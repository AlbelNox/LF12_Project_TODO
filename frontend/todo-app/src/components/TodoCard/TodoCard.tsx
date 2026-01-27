import type { Todo } from "@/types/TodoList";
import { Card, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";

type TodoCardProps = {
  todo: Todo;
  todoChecked?: (id: number, checked: boolean) => void;
};

export default function TodoCard({ todo, todoChecked }: TodoCardProps) {
  const renderPriority = (priority: string) => {
    switch (priority) {
      case "low":
        return (
          <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
            Niedrig
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Mittel
          </Badge>
        );
      case "high":
        return (
          <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
            Hoch
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="mb-4 relative" key={todo.id}>
      <CardContent className="p-6">
        <div
          className={`grid grid-cols-4 items-center gap-4 transition-all relative ${
            todo.checked ? "opacity-50" : ""
          }`}
        >
          {todo.checked && (
            <div
              className="absolute left-0 right-0 top-1/2 h-0.5 bg-black/40 pointer-events-none"
              style={{ transform: "translateY(-50%)" }}
            />
          )}
          <div className="flex items-center gap-4">
            <Checkbox
              className="checkBox"
              checked={todo.checked}
              onCheckedChange={(checked) => todoChecked?.(todo.id, checked as boolean)}
            />
            <span className="font-medium transition-all">{todo.title}</span>
          </div>
          <div className="font-medium">{renderPriority(todo.priority)}</div>
          <div className="font-medium">{todo.dueDate}</div>
          <div />
        </div>
      </CardContent>
    </Card>
  );
}
