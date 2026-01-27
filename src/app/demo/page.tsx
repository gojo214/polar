"use client";

import { Button } from "@/components/ui/button";

export default function DemoPage() {
  const handleApi = async () => {
     const response = await fetch("/api/demo/blocking", { method: "POST" });
     return response.json();
  };
  return (
    <div>
      <Button onClick={handleApi}>handleApi</Button>
      Demopage
    </div>
  );
}
