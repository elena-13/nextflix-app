import qs from 'qs';

export type RouteSearchParams = Readonly<Record<string, string | string[] | undefined>>;

export const asString = (value: unknown, fallback = ''): string => {
  if (value == null) return fallback;
  return String(value);
};

export const asNumber = (value: unknown, fallback = 0): number => {
  const num = Number(value);
  return isNaN(num) ? fallback : num;
};

export const asBoolean = (value: unknown, fallback = false): boolean => {
  if (value == null) return fallback;
  if (typeof value === 'boolean') return value;

  const str = String(value).toLowerCase();
  return ['true', '1', 'yes'].includes(str);
};

export const getQueryFrom = (
  searchParams?: RouteSearchParams,
  key = 'query',
  fallback = ''
): string => {
  if (!searchParams?.[key]) return fallback;

  const value = searchParams[key];
  return asString(value, fallback);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseSearchParams = <T = any>(searchParams: RouteSearchParams): T => {
  const stringified = qs.stringify(searchParams, { arrayFormat: 'brackets' });
  return qs.parse(stringified, { ignoreQueryPrefix: true }) as T;
};

export const stringifySearchParams = (params: Record<string, unknown>): string => {
  return qs.stringify(params, { arrayFormat: 'brackets', encode: false });
};
