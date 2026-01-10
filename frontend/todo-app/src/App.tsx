import NavBar from "./components/NavBar/NavBar";
import MainView from "./components/MainView/MainView";
import { mockTodoLists } from "./mock/mocklists";
import React from "react";

export default function TodoAppLayout() {
  const [selectedTodoListId, setSelectedTodoListId] = React.useState<number>(
    mockTodoLists[0].id
  );

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <NavBar
        onSelectTodoList={setSelectedTodoListId}
        todoLists={mockTodoLists}
      />

      {/* Main Content Area */}
      <MainView
        todoList={
          mockTodoLists.find((list) => list.id === selectedTodoListId) ??
          mockTodoLists[0]
        }
      />
    </div>
  );
}
