import { createServer, IncomingMessage, ServerResponse } from 'http';
import supertest from 'supertest';
import type { Prisma } from '@prisma/client';

import { DELETE, GET, POST } from '@/app/api/favorites/route';

type FilmRecord = Prisma.FilmCreateInput & { id: string };
type FavoriteRecord = { id: number; userId: number; filmId: string };
type FavoriteStoreRecord = FavoriteRecord & { film?: FilmRecord };

jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/ghibliApi', () => ({
  getFilmById: jest.fn(),
}));

jest.mock('@/lib/prisma', () => {
  const films = new Map<string, FilmRecord>();
  const favorites: FavoriteRecord[] = [];
  let favoriteId = 1;

  const prismaMock: {
    film: {
      findUnique: jest.Mock<Promise<FilmRecord | null>, [Prisma.FilmFindUniqueArgs]>;
      upsert: jest.Mock<Promise<FilmRecord>, [Prisma.FilmUpsertArgs]>;
    };
    favorite: {
      findMany: jest.Mock<Promise<FavoriteStoreRecord[]>, [Prisma.FavoriteFindManyArgs]>;
      upsert: jest.Mock<Promise<FavoriteRecord>, [Prisma.FavoriteUpsertArgs]>;
      deleteMany: jest.Mock<Promise<{ count: number }>, [Prisma.FavoriteDeleteManyArgs]>;
    };
    __reset: () => void;
  } = {
    film: {
      findUnique: jest.fn(async ({ where }) => {
        const id = where?.id as string | undefined;
        if (!id) {
          return null;
        }
        return films.get(id) ?? null;
      }),
      upsert: jest.fn(async ({ where, create }) => {
        const id = where.id as string;
        if (!films.has(id)) {
          films.set(id, { ...(create as FilmRecord) });
        }
        return films.get(id)!;
      }),
    },
    favorite: {
      findMany: jest.fn(async ({ where, include }) => {
        const userId = where?.userId as number;
        return favorites
          .filter((favorite) => favorite.userId === userId)
          .map((favorite) => ({
            ...favorite,
            film: include?.film ? films.get(favorite.filmId) : undefined,
          }));
      }),
      upsert: jest.fn(async ({ where, create }) => {
        const userId_filmId = where.userId_filmId as { userId: number; filmId: string };
        const existing = favorites.find(
          (favorite) =>
            favorite.userId === userId_filmId.userId && favorite.filmId === userId_filmId.filmId,
        );
        if (existing) {
          return existing;
        }
        const record: FavoriteRecord = {
          id: favoriteId,
          userId: create.userId as number,
          filmId: create.filmId as string,
        };
        favoriteId += 1;
        favorites.push(record);
        return record;
      }),
      deleteMany: jest.fn(async ({ where }) => {
        const userId = where?.userId as number;
        const filmId = where?.filmId as string;
        const initialLength = favorites.length;
        for (let index = favorites.length - 1; index >= 0; index -= 1) {
          const fav = favorites[index];
          if (fav.userId === userId && fav.filmId === filmId) {
            favorites.splice(index, 1);
          }
        }
        return { count: initialLength - favorites.length };
      }),
    },
    __reset: () => {
      films.clear();
      favorites.splice(0, favorites.length);
      favoriteId = 1;
    },
  };

  return { prisma: prismaMock };
});

const { getServerSession } = jest.requireMock('next-auth/next');
const { prisma } = jest.requireMock('@/lib/prisma');
const { getFilmById } = jest.requireMock('@/lib/ghibliApi');

function toRequest(req: IncomingMessage, body: string) {
  const url = new URL(req.url ?? '/', 'http://localhost');
  return new Request(url.toString(), {
    method: req.method,
    headers: req.headers as HeadersInit,
    body: body.length > 0 && req.method !== 'GET' && req.method !== 'HEAD' ? body : undefined,
  });
}

function handler(req: IncomingMessage, res: ServerResponse) {
  const chunks: Uint8Array[] = [];
  req.on('data', (chunk) => chunks.push(chunk));
  req.on('end', async () => {
    const body = Buffer.concat(chunks).toString();
    let response: Response;

    try {
      switch (req.method) {
        case 'GET':
          response = await GET();
          break;
        case 'POST':
          response = await POST(toRequest(req, body));
          break;
        case 'DELETE':
          response = await DELETE(toRequest(req, body));
          break;
        default:
          res.statusCode = 405;
          res.end();
          return;
      }

      res.statusCode = response.status;
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
      const text = await response.text();
      res.end(text);
    } catch (error) {
      res.statusCode = 500;
      res.end((error as Error).message);
    }
  });
}

function createTestServer() {
  return createServer(handler);
}

const describeMaybe = process.env.RUN_FAVORITES_INTEGRATION === 'true' ? describe : describe.skip;

describeMaybe('/api/favorites integration', () => {
  beforeEach(() => {
    prisma.__reset();
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (getFilmById as jest.Mock).mockResolvedValue({
      id: 'test-film',
      title: 'Totoro',
      director: 'Hayao Miyazaki',
      producer: 'Toru Hara',
      release_date: '1988',
      rt_score: '93',
      data: {},
      original_title: '',
      original_title_romanised: '',
      description: '',
      movie_banner: '',
      image: '',
      running_time: '86',
    });
  });

  async function setupServer() {
    const server = createTestServer();
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    return server;
  }

  it('allows adding, listing, and removing favorites', async () => {
    const server = await setupServer();
    const request = supertest(server);

    await request.post('/api/favorites').send({ filmId: 'test-film' }).expect(201);

    const listResponse = await request.get('/api/favorites').expect(200);
    expect(listResponse.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'test-film', title: 'Totoro' })]),
    );

    await request.delete('/api/favorites').send({ filmId: 'test-film' }).expect(200);

    const emptyResponse = await request.get('/api/favorites').expect(200);
    expect(emptyResponse.body).toEqual([]);

    await new Promise((resolve) => server.close(resolve));
  });

  it('rejects unauthorized requests', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    const server = await setupServer();
    const request = supertest(server);

    await request.get('/api/favorites').expect(401);
    await request.post('/api/favorites').send({ filmId: 'test-film' }).expect(401);

    await new Promise((resolve) => server.close(resolve));
  });
});
