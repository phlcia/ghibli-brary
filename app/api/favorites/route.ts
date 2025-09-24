import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import type { Prisma } from '@prisma/client';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getFilmById } from '@/lib/ghibliApi';

const FavoriteSchema = z.object({
  filmId: z.string().min(1, 'Film id is required'),
});

type SessionWithId = Awaited<ReturnType<typeof getServerSession>> & {
  user?: { id?: string | number };
};

function requireSession(session: Awaited<ReturnType<typeof getServerSession>>) {
  const userId = (session as SessionWithId | null)?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

function getUserId(session: Awaited<ReturnType<typeof getServerSession>>): number {
  const userId = (session as SessionWithId | null)?.user?.id;
  return Number(userId);
}

export async function GET() {
  const session = await getServerSession(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authOptions as any,
  );
  const unauthorized = requireSession(session);
  if (unauthorized) {
    return unauthorized;
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: getUserId(session) },
    include: { film: true },
    orderBy: { id: 'desc' },
  });

  return NextResponse.json(
    favorites.map(({ film }) => ({
      id: film.id,
      title: film.title,
      director: film.director,
      producer: film.producer,
      releaseYear: film.releaseYear,
      rtScore: film.rtScore,
      data: film.data,
    })),
  );
}

async function ensureFilmExists(filmId: string) {
  const existing = await prisma.film.findUnique({ where: { id: filmId } });
  if (existing) {
    return existing;
  }

  const film = await getFilmById(filmId);
  if (!film) {
    throw new Error('Film not found');
  }

  const releaseYear = Number.parseInt(film.release_date, 10);
  const rtScore = Number.parseInt(film.rt_score, 10);

  return prisma.film.upsert({
    where: { id: filmId },
    update: {},
    create: {
      id: film.id,
      title: film.title,
      director: film.director,
      producer: film.producer,
      releaseYear: Number.isFinite(releaseYear) ? releaseYear : 0,
      rtScore: Number.isFinite(rtScore) ? rtScore : 0,
      data: film as unknown as Prisma.JsonObject,
    },
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authOptions as any,
  );
  const unauthorized = requireSession(session);
  if (unauthorized) {
    return unauthorized;
  }

  const body = await request.json();
  const { filmId } = FavoriteSchema.parse(body);

  try {
    await ensureFilmExists(filmId);
  } catch {
    return NextResponse.json({ error: 'Film not found' }, { status: 404 });
  }

  await prisma.favorite.upsert({
    where: {
      userId_filmId: {
        userId: getUserId(session),
        filmId,
      },
    },
    create: {
      userId: getUserId(session),
      filmId,
    },
    update: {},
  });

  return NextResponse.json({ success: true }, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await getServerSession(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authOptions as any,
  );
  const unauthorized = requireSession(session);
  if (unauthorized) {
    return unauthorized;
  }

  const body = await request.json();
  const { filmId } = FavoriteSchema.parse(body);

  await prisma.favorite.deleteMany({
    where: {
      userId: getUserId(session),
      filmId,
    },
  });

  return NextResponse.json({ success: true });
}
