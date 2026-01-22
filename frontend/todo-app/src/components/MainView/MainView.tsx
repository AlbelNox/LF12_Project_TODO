import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import React from "react";
import type { TodoList } from "@/types/TodoList";
import "./MainView.css";

type MainViewProps = {
  todoList: TodoList;
};

export default function MainView({ todoList }: MainViewProps) {
  return (
    <>
      <main className="flex-1 p-8">
        <React.Fragment key={todoList.id}>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold">Einkaufsliste</h1>
            <Button variant="outline">Filter</Button>
          </div>

          {todoList.todos.map((todo) => (
            <Card className="mb-4" key={todo.id}>
              <CardContent className="p-6">
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="flex items-center gap-4">
                    <Checkbox className="checkBox" />
                    <span className="font-medium">{todo.title}</span>
                  </div>
                  <div className="font-medium">{todo.priority}</div>
                  <div className="font-medium">{todo.dueDate}</div>
                  <div />
                </div>
              </CardContent>
            </Card>
          ))}
        </React.Fragment>

        {/* Header */}
      </main>
    </>
  );
}
