import type { TodoList } from "@/types/TodoList";

export const mockTodoLists: TodoList[] = [
  {
    id: 1,
    name: "Meine Liste",
    todos: [
      {
        checked: false,
        priority: "high",
        dueDate: "2023-10-15",
        title: "Erste Aufgabe",
        id: 1,
      },
    ],
  },
  {
    id: 2,
    name: "Zweite Liste",
    todos: [
      {
        checked: false,
        priority: "medium",
        dueDate: "2023-10-20",
        title: "Zweite Aufgabe",
        id: 2,
      },
    ],
  },
];
