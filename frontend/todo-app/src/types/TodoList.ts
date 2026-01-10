export type TodoList = {
  id: number;
  name: string;
  todos: Todo[];
};

type Todo = {
    checked: boolean;
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
    title: string;
    id: number;
}