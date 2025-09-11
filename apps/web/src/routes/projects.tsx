import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Trash2 } from "lucide-react";

import { orpc } from "@shared/orpc";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function Projects() {
  const [newProjectText, setNewProjectText] = useState("");

  const projects = useQuery(orpc.project.list.queryOptions({ input: {} }));

  // const createMutation = useMutation(
  //   orpc.project.create.mutationOptions({
  //     onSuccess: () => {
  //       projects.refetch();
  //       setNewProjectText("");
  //     },
  //   }),
  // );

  const deleteMutation = useMutation(
    orpc.project.delete.mutationOptions({
      onSuccess: () => {
        projects.refetch();
      },
    }),
  );

  // const handleAddProject = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (newProjectText.trim()) {
  //     createMutation.mutate({ text: newProjectText });
  //   }
  // };

  const handleDeleteProject = (id: number) => {
    deleteMutation.mutate({ id });
  };

  return (
    <div className="w-full mx-auto max-w-md py-10">
      <Card>
        <CardHeader>
          <CardTitle>Проекты</CardTitle>
          <CardDescription>Перечень реализованных проектов</CardDescription>
        </CardHeader>
        <CardContent>
          {/* <form
            onSubmit={handleAddTodo}
            className="mb-6 flex items-center space-x-2"
          >
            <Input
              value={newProjectText}
              onChange={(e) => setNewProjectText(e.target.value)}
              placeholder="Add a new project..."
              disabled={createMutation.isPending}
            />
            <Button
              type="submit"
              disabled={createMutation.isPending || !newProjectText.trim()}
            >
              {createMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Add"
              )}
            </Button>
          </form> */}

          {projects.isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : projects.data?.length === 0 ? (
            <p className="py-4 text-center">No projects yet. Add one above!</p>
          ) : (
            <ul className="space-y-2">
              {projects.data?.map((project) => (
                <li
                  key={project.id}
                  className="flex items-center justify-between rounded-md border p-2"
                >
                  <div className="flex items-center space-x-2">
                    <p>{project.title}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteProject(project.id)}
                    aria-label="Delete project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
