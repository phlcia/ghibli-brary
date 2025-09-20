import { clearApiCache, getFilmById, getFilms } from '@/lib/ghibliApi';
import type { Film } from '@/types/film';

describe('ghibliApi', () => {
  const mockFilms: Film[] = [
    {
      id: '1',
      title: 'My Neighbor Totoro',
      original_title: 'となりのトトロ',
      original_title_romanised: 'Tonari no Totoro',
      image: 'https://image.tmdb.org/t/p/test.jpg',
      movie_banner: 'https://image.tmdb.org/t/p/banner.jpg',
      description: 'Two girls move to the country to be near their ailing mother.',
      director: 'Hayao Miyazaki',
      producer: 'Toru Hara',
      release_date: '1988',
      running_time: '86',
      rt_score: '93',
    },
  ];

  let fetchMock: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
    clearApiCache();
    fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('caches film list responses for 60 seconds', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockFilms),
      status: 200,
      statusText: 'OK',
    });

    const first = await getFilms();
    const second = await getFilms();

    expect(first).toEqual(mockFilms);
    expect(second).toEqual(mockFilms);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    jest.setSystemTime(new Date('2024-01-01T00:01:01.000Z'));

    await getFilms();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('fetches individual films and caches per id', async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockFilms),
        status: 200,
        statusText: 'OK',
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockFilms[0]),
        status: 200,
        statusText: 'OK',
      });

    const films = await getFilms();
    expect(films).toHaveLength(1);

    const firstCall = await getFilmById('1');
    const secondCall = await getFilmById('1');

    expect(firstCall.title).toBe('My Neighbor Totoro');
    expect(secondCall.title).toBe('My Neighbor Totoro');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('throws when the API request is not ok', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Server Error',
      json: jest.fn(),
    });

    await expect(getFilms()).rejects.toThrow('Failed to fetch');
  });
});
