import { useState } from "react";
import { Button } from "../ui/button";
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
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import type { Todo } from "@/types/TodoList";
import { Calendar } from "../ui/calendar";

type TodoCreationDialogProps = {
  onCreateTodo: (todo: Todo) => void;
};

export default function TodoCreationDialog({
  onCreateTodo,
}: TodoCreationDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

  const handleTodoCreation = (todo: Todo) => {
    console.log("handleTodoCreation called");
    console.log(`Creating todo with name: ${todo.title}`);
    console.log("New todo to be created:", todo);
    onCreateTodo?.(todo);

    setSelectedPriority("");
    setDueDate(undefined);
  };

  const renderPriority = () => {
    switch (selectedPriority) {
      case "low":
        return "Niedrig";
      case "medium":
        return "Mittel";
      case "high":
        return "Hoch";
      default:
        return "Priorität wählen";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">+ Neues Todo erstellen</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Neues Todo erstellen</DialogTitle>
          <DialogDescription>
            Geben Sie die Infos zu dem neuen Todo an.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const name = formData.get("name") as string;
            handleTodoCreation({
              id: Date.now(),
              title: name,
              checked: false,
              priority:
                selectedPriority === "low" ||
                selectedPriority === "medium" ||
                selectedPriority === "high"
                  ? selectedPriority
                  : "medium",
              dueDate: dueDate
                ? dueDate.toLocaleDateString("de-DE")
                : "",
            });
            setOpen(false); // Dialog schließen
          }}
        >
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" placeholder="Todo Name" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="priority-1">Priorität</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">{renderPriority()}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => setSelectedPriority("low")}
                    >
                      Niedrig
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedPriority("medium")}
                    >
                      Mittel
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedPriority("high")}
                    >
                      Hoch
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="dueDate-1">Fälligkeit</Label>
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                className="rounded-lg border"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Todo hinzufügen</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
