export interface Film {
  id: string;
  title: string;
  original_title: string;
  original_title_romanised: string;
  image: string;
  movie_banner: string;
  description: string;
  director: string;
  producer: string;
  release_date: string;
  running_time: string;
  rt_score: string;
}

export type FilmSortOption = 'title-asc' | 'release-desc' | 'rating-desc';

export interface FilmFilters {
  search: string;
  directors: string[];
  producers: string[];
  years: string[];
  minScore: number;
  page: number;
  pageSize: number;
  sort: FilmSortOption;
}

export interface FilmDataState {
  films: Film[];
  directors: string[];
  producers: string[];
  years: string[];
}
