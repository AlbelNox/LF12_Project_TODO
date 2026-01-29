import { Button } from "../ui/button";
import React from "react";
import type { Todo, TodoList } from "@/types/TodoList";
import "./TodoListView.css";
import TodoCreationDialog from "../TodoCreationDialog/TodoCreationDialog";
import TodoCard from "../TodoCard/TodoCard";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../ui/dropdown-menu";

type TodoListViewProps = {
  todoList: TodoList;
  onAddTodo: (todo: Todo) => void;
  onDeleteTodoList: () => void;
  onCheckedTodoChange: (checkedTodos: number[]) => void;
};

export default function TodoListView({
  todoList,
  onAddTodo,
  onDeleteTodoList,
  onCheckedTodoChange,
}: TodoListViewProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  // Filter-States
  const [filterPriority, setFilterPriority] = React.useState<string>("all");
  const [filterName, setFilterName] = React.useState<string>("");
  const [filterDueDate, setFilterDueDate] = React.useState<string>("");
  const [filterOpen, setFilterOpen] = React.useState(false);

  // Direktes Callback für Checkbox
  const handleTodoChecked = (id: number, checked: boolean) => {
    const updated = checked
      ? [...todoList.todos.filter((t) => t.checked).map((t) => t.id), id]
      : todoList.todos.filter((t) => t.checked && t.id !== id).map((t) => t.id);
    onCheckedTodoChange(updated);
  };

  // Filter-Logik
  const filteredTodos = todoList.todos
    .filter((todo) =>
      filterPriority === "all" ? true : todo.priority === filterPriority
    )
    .filter((todo) =>
      filterName.trim() === ""
        ? true
        : todo.title.toLowerCase().includes(filterName.trim().toLowerCase())
    )
    .filter((todo) =>
      filterDueDate === "" ? true : todo.dueDate === filterDueDate
    );

  return (
    <>
      <main className="flex-1 p-8 relative min-h-[80vh]">
        <React.Fragment key={todoList.id}>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold">{todoList.name}</h1>
            <div className="flex gap-4">
              <TodoCreationDialog onCreateTodo={onAddTodo} />
              {/* Filter Dropdown mit shadcn */}
              <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" type="button">
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72">
                  <DropdownMenuLabel>Filtern nach</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1">
                    <label className="block text-xs mb-1">Priorität</label>
                    <select
                      className="w-full border rounded px-2 py-1 mb-2"
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                    >
                      <option value="all">Alle</option>
                      <option value="low">Niedrig</option>
                      <option value="medium">Mittel</option>
                      <option value="high">Hoch</option>
                    </select>
                  </div>
                  <div className="px-2 py-1">
                    <label className="block text-xs mb-1">Name</label>
                    <input
                      className="w-full border rounded px-2 py-1 mb-2"
                      type="text"
                      placeholder="Nach Name filtern"
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                    />
                  </div>
                  <div className="px-2 py-1">
                    <label className="block text-xs mb-1">
                      Fälligkeitsdatum
                    </label>
                    <input
                      className="w-full border rounded px-2 py-1"
                      type="text"
                      placeholder="TT.MM.JJJJ"
                      value={filterDueDate}
                      onChange={(e) => setFilterDueDate(e.target.value)}
                    />
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setFilterPriority("all");
                      setFilterName("");
                      setFilterDueDate("");
                      setFilterOpen(false);
                    }}
                  >
                    Filter zurücksetzen
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[80vh] pr-2">
            {filteredTodos.map((todo) => (
              <TodoCard
                todo={todo}
                key={todo.id}
                todoChecked={handleTodoChecked}
              />
            ))}
          </div>
        </React.Fragment>
        <div className="absolute left-0 bottom-0 p-8">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                disabled={
                  todoList.todos.length === 0 ||
                  todoList.todos.filter((t) => t.checked).length !==
                    todoList.todos.length
                }
              >
                Liste abschließen
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Liste abschließen</DialogTitle>
                <DialogDescription>
                  Diese Aktion kann nicht rückgängig gemacht werden. Die Liste
                  wird vollständig gelöscht.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button variant="outline">Abbrechen</Button>
                </DialogClose>
                <Button
                  type="button"
                  onClick={() => {
                    onDeleteTodoList();
                    setDialogOpen(false);
                  }}
                  variant="destructive"
                >
                  Bestätigen
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </>
  );
}
