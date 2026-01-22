import NavBar from "./components/NavBar/NavBar";
import MainView from "./components/MainView/MainView";
import { mockTodoLists } from "./mock/mocklists";
import React from "react";
import { createApiService } from "./services/apiService";
import { useFetch } from "./hooks/useFetch";
import { createTodoListService } from "./services/TodoListServices";
import type { TodoList } from "./types/TodoList";

export default function TodoAppLayout() {
  const { execute } = useFetch();

  const api = createApiService(execute);

  const todoListService = createTodoListService(api);

  const [selectedTodoListId, setSelectedTodoListId] = React.useState<number>(
    mockTodoLists[0].id
  );

  React.useEffect(() => {
    var todoLists = todoListService.getTodoLists();

    console.log(todoLists);
  }, []);

  return (
    <div className="flex h-screen bg-white">
      <NavBar
        onSelectTodoList={setSelectedTodoListId}
        todoLists={mockTodoLists}
      />
      <MainView
        todoList={
          mockTodoLists.find((list) => list.id === selectedTodoListId) ??
          mockTodoLists[0]
        }
      />
    </div>
  );
}
