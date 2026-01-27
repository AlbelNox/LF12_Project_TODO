import "react";
import { Button } from "../ui/button";
import type { TodoList } from "@/types/TodoList";
import ListCreationDialog from "../ListCreationDialog/ListCreationDialog";

type NavBarProps = {
  todoLists: TodoList[];
  onSelectTodoList: (id: number) => void;
  onListCreated: (list: TodoList) => void;
  onViewTaskDueSoon: () => void;
  selectedListId: number;
};

export default function NavBar({
  todoLists,
  onSelectTodoList,
  onListCreated,
  onViewTaskDueSoon,
  selectedListId,
}: NavBarProps) {


  const handleListCreation = (list: TodoList) => {
    console.log("New list created:", list);
    onListCreated(list);
  };

  return (
    <>
      <aside className="w-64 bg-gray-200 p-4 flex flex-col justify-between">
        <div>
          <ListCreationDialog onCreateList={handleListCreation} />
          <ul className="space-y-2 text-sm">
            {todoLists.map((list) => (
              <li className="cursor-pointer hover:underline" key={list.id}>
                <Button
                  variant={selectedListId === list.id ? "secondary" : "ghost"}
                  onClick={() => onSelectTodoList(list.id)}
                  key={list.id}
                  className={
                    selectedListId === list.id
                      ? "border bg-background shadow-xs dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
                      : ""
                  }
                >
                  {list.name}
                </Button>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-xs text-gray-600">
          <Button variant="ghost" onClick={onViewTaskDueSoon}>
            Bald fällige Aufgaben
          </Button>
        </div>
      </aside>
    </>
  );
}
