// import type { FetchOptions } from "../hooks/useFetch";

// export type ApiExecutor<T> = (
//   url: string,
//   options?: FetchOptions
// ) => Promise<T>;

// export function createApiService<TExecutor extends ApiExecutor<unknown>>(
//   execute: TExecutor
// ) {
//   return {
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     get: <T>(url: string) => execute(url, { method: "GET" }),

//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     post: <T>(url: string, body: BodyInit | null | undefined) =>
//       execute(url, { method: "POST", body }),

//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     put: <T>(url: string, body: BodyInit | null | undefined) =>
//       execute(url, { method: "PUT", body }),

//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     delete: <T>(url: string) => execute(url, { method: "DELETE" }),
//   };
// }
