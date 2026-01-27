import React, { useState } from "react";
import type { TodoList } from "@/types/TodoList";
import { TodoCardListLink } from "../TodoCard/TodoCardListLink";

type TasksDueSoonProps = {
  lists: TodoList[];
  onNavigateToList: (listId: number) => void;
};

function isDueInNDays(dueDateStr: string, days: number) {
  if (!dueDateStr) return false;
  const today = new Date();
  const dueDate = new Date(dueDateStr.split(".").reverse().join("-"));
  const diffTime = dueDate.getTime() - today.setHours(0, 0, 0, 0);
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= days;
}

export default function TasksDueSoon({
  lists,
  onNavigateToList,
}: TasksDueSoonProps) {
  const [days, setDays] = useState(30);

  const todosDueSoon = lists
    .flatMap((list) => list.todos.map((todo) => ({ ...todo, listId: list.id })))
    .filter((todo) => isDueInNDays(todo.dueDate, days) && !todo.checked);

  return (
    <main className="flex-1 p-8">
      <React.Fragment>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold">Bald fällige Aufgaben</h1>
          <div className="flex items-center gap-2">
            <label htmlFor="daysInput" className="text-sm">
              Zeitraum (Tage):
            </label>
            <input
              id="daysInput"
              type="number"
              min={1}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="border rounded px-2 py-1 w-20"
            />
          </div>
        </div>
        <div className="overflow-y-auto max-h-[80vh] pr-2">
          {todosDueSoon.length === 0 ? (
            <p className="text-sm text-gray-600">
              Keine Aufgaben in den nächsten {days} Tagen fällig.
            </p>
          ) : (
            todosDueSoon.map((todo) => (
              <TodoCardListLink
                key={todo.id}
                todo={todo}
                listId={todo.listId}
                onNavigateToList={onNavigateToList}
                listName={lists.find((list) => list.id === todo.listId)?.name}
              />
            ))
          )}
        </div>
      </React.Fragment>
    </main>
  );
}
