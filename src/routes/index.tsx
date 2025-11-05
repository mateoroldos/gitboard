import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { validateRepoString } from "@/lib/github";
import {
  Authenticated,
  Unauthenticated,
  useAction,
  useConvexAuth,
} from "convex/react";
import { api } from "convex/_generated/api";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { RepoSelector } from "@/components/RepoSelector";
import { useMutation } from "@tanstack/react-query";
import { Loader, Plus } from "lucide-react";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  const { isLoading } = useConvexAuth();

  const [selectedRepo, setSelectedRepo] = useState("");
  const [error, setError] = useState("");

  const { mutate: createBoard, isPending } = useMutation({
    mutationFn: useAction(api.boards.createBoardAction),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRepo.trim()) {
      setError("Please select a repository");
      return;
    }

    if (!validateRepoString(selectedRepo.trim())) {
      setError("Please select a valid repository");
      return;
    }

    const [owner, name] = selectedRepo.trim().split("/");

    createBoard(
      {
        name,
        repo: selectedRepo.trim(),
      },
      {
        onSuccess: () => {
          window.location.href = `/${owner}/${name}`;
        },
      },
    );
  };

  if (isLoading) {
    return <span>Loading...</span>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-sm w-full space-y-8 flex items-center flex-col">
        <div className="text-center">
          <h1 className="text-4xl font-bold">GitBoard</h1>
          <p className="text-muted-foreground">
            The open source canvas for open source projects
          </p>
        </div>

        <Unauthenticated>
          <Button onClick={signIn}>Sign In</Button>
        </Unauthenticated>

        <Authenticated>
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div>
              <Label htmlFor="repo">GitHub Repository</Label>
              <RepoSelector
                value={selectedRepo}
                onValueChange={(value) => {
                  setSelectedRepo(value);
                  setError("");
                }}
                placeholder="Select a repository..."
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <Loader className="animate-spin" /> : <Plus />}
              Create Board
            </Button>
          </form>
        </Authenticated>
      </div>
    </div>
  );
}
