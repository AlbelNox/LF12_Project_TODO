import NavBar from "./components/NavBar/NavBar";
import { mockTodoLists } from "./mock/mocklists";
import React from "react";
import TodoListView from "./components/TodolistView/TodoListView";
import TasksDueSoon from "./components/ExpiringTodos/TasksDueSoon";
import { localStorageService } from "./services/localStorageService";

export default function TodoAppLayout() {
  // Lade Listen aus localStorage oder verwende Fallback
  const getInitialLists = () => {
    const storedLists = localStorageService.loadTodoLists();
    return storedLists || mockTodoLists;
  };

  const [selectedTodoListId, setSelectedTodoListId] = React.useState<number>(
    getInitialLists()[0].id
  );

  const [currentView, setCurrentView] = React.useState<
    "taskDueDate" | "todoListView"
  >("todoListView");

  const [todoLists, setTodoLists] = React.useState(getInitialLists());

  // Speichere Listen automatisch im localStorage, wenn sie sich ändern
  React.useEffect(() => {
    localStorageService.saveTodoLists(todoLists);
  }, [todoLists]);

  const handleDeleteTodoList = () => {
    console.log("Deleting todo list with ID:", selectedTodoListId);
    setTodoLists((prevLists) =>
      prevLists.filter((list) => list.id !== selectedTodoListId)
    );
  };

  const handleCheckedTodoChange = (checkedTodos: number[]) => {
    setTodoLists((prevLists) =>
      prevLists.map((list) =>
        list.id === selectedTodoListId
          ? {
              ...list,
              todos: list.todos.map((todo) => ({
                ...todo,
                checked: checkedTodos.includes(todo.id),
              })),
            }
          : list
      )
    );
    console.log(todoLists);
  };

  return (
    <div className="flex h-screen bg-white">
      <NavBar
        selectedListId={selectedTodoListId}
        onViewTaskDueSoon={() => {
          setCurrentView("taskDueDate");
          setSelectedTodoListId(-1);
        }}
        onSelectTodoList={(id: number) => {
          setSelectedTodoListId(id);
          setCurrentView("todoListView");
        }}
        todoLists={todoLists}
        onListCreated={(newList) => {
          console.log("List created in NavBar:", newList);
          setTodoLists([...todoLists, newList]);
        }}
      />

      {currentView === "todoListView" ? (
        <TodoListView
          onCheckedTodoChange={handleCheckedTodoChange}
          onDeleteTodoList={handleDeleteTodoList}
          todoList={
            todoLists.find((list) => list.id === selectedTodoListId) ??
            todoLists[0]
          }
          onAddTodo={(newTodo) => {
            console.log(
              "Adding new todo to list ID",
              selectedTodoListId,
              ":",
              newTodo
            );
            setTodoLists((prevLists) =>
              prevLists.map((list) =>
                list.id === selectedTodoListId
                  ? { ...list, todos: [...list.todos, newTodo] }
                  : list
              )
            );
          }}
        />
      ) : (
        <TasksDueSoon
          lists={todoLists}
          onNavigateToList={(listId) => {
            setSelectedTodoListId(listId);
            setCurrentView("todoListView");
          }}
        />
      )}
    </div>
  );
}
