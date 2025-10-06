export const paths = {
  home: () => '/',
  search: () => '/search',
  watchlist: () => '/watchlist',

  movie: (id: number | string) => `/movie/${id}`,
  person: (id: number | string) => `/person/${id}`,

  searchWithQuery: (query: string) => `/search?query=${encodeURIComponent(query)}`,
};
