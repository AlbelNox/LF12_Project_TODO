import type { TodoList } from "@/types/TodoList";

const STORAGE_KEY = "todoLists";

export const localStorageService = {
  // Speichert die Listen im localStorage
  saveTodoLists: (lists: TodoList[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
    } catch (error) {
      console.error("Fehler beim Speichern der Listen:", error);
    }
  },

  // Lädt die Listen aus dem localStorage
  loadTodoLists: (): TodoList[] | null => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      return storedData ? JSON.parse(storedData) : null;
    } catch (error) {
      console.error("Fehler beim Laden der Listen:", error);
      return null;
    }
  },

  // Löscht alle Listen aus dem localStorage
  clearTodoLists: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Fehler beim Löschen der Listen:", error);
    }
  },

  // Prüft, ob bereits Listen im localStorage gespeichert sind
  hasStoredLists: (): boolean => {
    return localStorage.getItem(STORAGE_KEY) !== null;
  },
};
