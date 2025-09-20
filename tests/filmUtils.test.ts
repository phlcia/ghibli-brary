import { applyFilters, applySort, createDefaultFilters, paginateFilms } from '@/lib/filmUtils';
import type { Film } from '@/types/film';

const films: Film[] = [
  {
    id: '1',
    title: 'My Neighbor Totoro',
    original_title: 'となりのトトロ',
    original_title_romanised: 'Tonari no Totoro',
    image: 'https://example.com/totoro.jpg',
    movie_banner: 'https://example.com/totoro-banner.jpg',
    description: 'Two sisters encounter woodland spirits.',
    director: 'Hayao Miyazaki',
    producer: 'Toru Hara',
    release_date: '1988',
    running_time: '86',
    rt_score: '93',
  },
  {
    id: '2',
    title: 'Spirited Away',
    original_title: '千と千尋の神隠し',
    original_title_romanised: 'Sen to Chihiro no Kamikakushi',
    image: 'https://example.com/spirited.jpg',
    movie_banner: 'https://example.com/spirited-banner.jpg',
    description: 'Chihiro enters the spirit world.',
    director: 'Hayao Miyazaki',
    producer: 'Toshio Suzuki',
    release_date: '2001',
    running_time: '125',
    rt_score: '97',
  },
  {
    id: '3',
    title: 'Whisper of the Heart',
    original_title: '耳をすませば',
    original_title_romanised: 'Mimi wo Sumaseba',
    image: 'https://example.com/whisper.jpg',
    movie_banner: 'https://example.com/whisper-banner.jpg',
    description: 'A young girl discovers her talent for writing.',
    director: 'Yoshifumi Kondō',
    producer: 'Toshio Suzuki',
    release_date: '1995',
    running_time: '111',
    rt_score: '91',
  },
];

describe('filmUtils', () => {
  it('filters by search term, director, and minimum score', () => {
    const filters = createDefaultFilters({
      search: 'spirit',
      directors: ['Hayao Miyazaki'],
      minScore: 95,
    });

    const result = applyFilters(films, filters);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Spirited Away');
  });

  it('filters by producer and year', () => {
    const filters = createDefaultFilters({
      producers: ['Toshio Suzuki'],
      years: ['1995'],
    });

    const result = applyFilters(films, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });

  it('sorts films by release date and rating', () => {
    const byRelease = applySort(films, 'release-desc');
    expect(byRelease.map((film) => film.release_date)).toEqual(['2001', '1995', '1988']);

    const byRating = applySort(films, 'rating-desc');
    expect(byRating.map((film) => film.rt_score)).toEqual(['97', '93', '91']);
  });

  it('paginates and clamps page numbers', () => {
    const { items, totalPages, currentPage } = paginateFilms(films, 3, 2);
    expect(totalPages).toBe(2);
    expect(currentPage).toBe(2);
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe('3');
  });
});
