import "react";
import { Button } from "../ui/button";
import type { TodoList } from "@/types/TodoList";

type NavBarProps = {
  todoLists: TodoList[];
  onSelectTodoList: (id: number) => void;
};

export default function NavBar({ todoLists, onSelectTodoList }: NavBarProps) {
  return (
    <>
      <aside className="w-64 bg-gray-200 p-4 flex flex-col justify-between">
        <div>
          <Button variant="ghost" className="w-full justify-start mb-4">
            + Neue Todo Liste
          </Button>

          <ul className="space-y-2 text-sm">
            {todoLists.map((list) => (
              <li className="cursor-pointer hover:underline">
                <Button
                  variant={"ghost"}
                  onClick={() => onSelectTodoList(list.id)}
                >
                  {list.name}
                </Button>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-xs text-gray-600">
          <Button variant="ghost">Bald fällige Aufgaben</Button>
        </div>
      </aside>
    </>
  );
}
