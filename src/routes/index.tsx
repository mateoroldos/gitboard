import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  return (
    <div className="min-h-screen flex items-center juotify-center p-8">
      Hello
    </div>
  );
}
