import type { FetchOptions } from "../hooks/useFetch";

export type ApiExecutor<T> = (
  url: string,
  options?: FetchOptions
) => Promise<T>;

export function createApiService<TExecutor extends ApiExecutor<any>>(
  execute: TExecutor
) {
  return {
    get: <T>(url: string) => execute(url, { method: "GET" }),

    post: <T>(url: string, body: BodyInit | null | undefined) =>
      execute(url, { method: "POST", body }),

    put: <T>(url: string, body: BodyInit | null | undefined) =>
      execute(url, { method: "PUT", body }),

    delete: <T>(url: string) => execute(url, { method: "DELETE" }),
  };
}
