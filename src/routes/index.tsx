import { GitHubStarsWidget } from "@/components/widgets/github-stars/GitHubStarsWidget";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">GitBoard Demo</h1>

      <div className="grid gap-4 max-w-md">
        <GitHubStarsWidget />
      </div>
    </div>
  );
}
