export const ServerAddress: string = "https://127.0.0.1:8080";

// Beispiel routen
export const Routes = {
    CREATE_LIST: "/lists/create",
    GET_LISTS: "/lists",
    GET_LIST_BY_ID: (id: number) => `/lists/${id}`,
    UPDATE_LIST: (id: number) => `/lists/${id}/update`,
    DELETE_LIST: (id: number) => `/lists/${id}/delete`,
    CREATE_TODO: (listId: number) => `/lists/${listId}/todos/create`,
    UPDATE_TODO: (listId: number, todoId: number) => `/lists/${listId}/todos/${todoId}/update`,
    DELETE_TODO: (listId: number, todoId: number) => `/lists/${listId}/todos/${todoId}/delete`,
};