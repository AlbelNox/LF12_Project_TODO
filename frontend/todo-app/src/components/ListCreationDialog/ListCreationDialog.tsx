import type { TodoList } from "@/types/TodoList";
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
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { mockTodoLists } from "@/mock/mocklists";
import { useState } from "react";

const useMocks = import.meta.env.VITE_USE_MOCKS === "true";
console.log("VITE_USE_MOCKS:", import.meta.env.VITE_USE_MOCKS, "useMocks:", useMocks);

type ListCreationDialogProps = {
  onCreateList: (list: TodoList) => void;
};

export default function ListCreationDialog({ onCreateList }: ListCreationDialogProps) {
  const [open, setOpen] = useState(false);

  const handleListCreation = (name: string) => {
    console.log("handleListCreation called");
    if (useMocks) {
      console.log(`Mock: Creating list with name: ${name}`);
      const newList = { id: mockTodoLists.length + 1, name, todos: [] };
      console.log("New list to be created:", newList);
      onCreateList(newList);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">+ Neue Liste erstellen</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Neue Liste erstellen</DialogTitle>
          <DialogDescription>
            Geben Sie den Namen der neuen Liste ein.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => {
          e.preventDefault();
          console.log("Form submitted");
          const formData = new FormData(e.currentTarget);
          const name = formData.get("name") as string;
          console.log(`Creating list with name: ${name}`);
          handleListCreation(name);
          setOpen(false); // Dialog schließen
        }}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" placeholder="Listen Name" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Liste hinzufügen</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
