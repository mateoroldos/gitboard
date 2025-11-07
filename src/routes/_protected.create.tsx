import { RepoSelector } from "@/components/RepoSelector";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { validateRepoString } from "@/lib/github";
import { convexAction, convexQuery } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { useAction } from "convex/react";
import { Loader, Plus } from "lucide-react";
import { Suspense, useState } from "react";

export const Route = createFileRoute("/_protected/create")({
  component: RouteComponent,
  beforeLoad: async (opts) => {
    const user = await opts.context.queryClient.ensureQueryData(
      convexQuery(api.auth.getUser, {}),
    );

    return { user };
  },
  loader: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/" });
    }

    await context.queryClient.prefetchQuery(
      convexAction(api.github.getAllRepos, {}),
    );
  },
});

function RouteComponent() {
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

  return (
    <div className="container mx-auto flex items-center justify-center p-8">
      <div className="max-w-sm w-full space-y-8 flex items-center flex-col">
        <div className="text-center">
          <h1 className="text-4xl font-bold">GitBoard</h1>
          <p className="text-muted-foreground">
            The open source canvas for open source projects
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div>
            <Label htmlFor="repo">GitHub Repository</Label>
            <Suspense fallback={<Skeleton className="w-full h-9" />}>
              <RepoSelector
                value={selectedRepo}
                onValueChange={(value) => {
                  setSelectedRepo(value);
                  setError("");
                }}
                placeholder="Select a repository..."
              />
            </Suspense>
            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <Loader className="animate-spin" /> : <Plus />}
            Create Board
          </Button>
        </form>
      </div>
    </div>
  );
}
