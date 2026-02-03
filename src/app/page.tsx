"use client";

import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@clerk/nextjs";
export default function Home() {
  const { userId } = useAuth();
  const projects = useQuery(api.projects.get);
  const createMutation = useMutation(api.projects.create);

  const handleClientError = () => {
    Sentry.logger.info("This is an info log from the client side", { userId });
    throw new Error("This is a test error from the client side");
  }
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24 text-white">
        <ModeToggle/>
        <Button
          onClick={async () => {
            await createMutation({ name: "New Project", ownerId: "owner123" });
          }}
        >
          Create project
        </Button>
        <Button onClick={handleClientError} className="bg-black text-white">Trigger Client Error</Button>
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
