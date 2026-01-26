"use client";

import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ModeToggle } from "@/components/ui/theme-toggle";
export default function Home() {
  const projects = useQuery(api.projects.get);
  const createMutation = useMutation(api.projects.create);
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24 ">
        <ModeToggle/>
        <Button
          onClick={async () => {
            await createMutation({ name: "New Project", ownerId: "owner123" });
          }}
        >
          Create project
        </Button>
        {projects?.map((project) => (
          <div
            className=" border rounded p-2 flex flex-col justify-center bg-white text-black"
            key={project._id}
          >
            {project.name}
            {project.ownerId}
          </div>
        ))}
      </main>
    </>
  );
}
