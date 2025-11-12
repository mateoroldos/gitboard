import { RepoSelector } from "@/components/RepoSelector";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { validateRepoString } from "@/lib/github";
import { convexAction, convexQuery } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { api } from "convex/_generated/api";
import { useAction } from "convex/react";
import { Loader, Plus } from "lucide-react";
import { Suspense } from "react";
import * as z from "zod";
import { FieldError } from "@/components/ui/field";

export const Route = createFileRoute("/_protected/create")({
  component: RouteComponent,
  beforeLoad: async (opts) => {
    const user = await opts.context.queryClient.ensureQueryData(
      convexQuery(api.auth.getUser, {}),
    );

    opts.context.queryClient.prefetchQuery(
      convexAction(api.github.getAllRepos, {}),
    );

    return { user };
  },
  loader: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/" });
    }
  },
});

const formSchema = z.object({
  repo: z
    .string()
    .min(1, "Please select a repository")
    .refine((value) => validateRepoString(value.trim()), {
      message: "Please select a valid repository",
    }),
});

function RouteComponent() {
  const navigate = useNavigate();

  const { mutate: createBoard, isPending } = useMutation({
    mutationFn: useAction(api.boards.createBoardAction),
  });

  const form = useForm({
    defaultValues: {
      repo: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const repoValue = value.repo.trim();
      const [owner, name] = repoValue.split("/");

      createBoard(
        {
          name,
          repo: repoValue,
        },
        {
          onSuccess: () => {
            navigate({ to: `/${owner}/${name}` });
          },
        },
      );
    },
  });

  return (
    <div className="container mx-auto flex items-center justify-center mt-24">
      <div className="max-w-6xl w-full space-y-12 flex items-center flex-col">
        <div className="text-center">
          <h1 className="text-4xl font-bold">GitBoard</h1>
          <p className="text-muted-foreground">
            The open source canvas for open source projects
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4 w-full max-w-sm"
        >
          <form.Field
            name="repo"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <div>
                  <Label htmlFor={field.name}>GitHub Repository</Label>
                  <Suspense fallback={<Skeleton className="w-full h-9" />}>
                    <RepoSelector
                      value={field.state.value}
                      onValueChange={field.handleChange}
                      placeholder="Select a repository..."
                    />
                  </Suspense>
                  {isInvalid && (
                    <FieldError className="mt-2 text-sm text-destructive">
                      {field.state.meta.errors}
                    </FieldError>
                  )}
                </div>
              );
            }}
          />

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                className="w-full"
                disabled={!canSubmit || isPending || isSubmitting}
              >
                {isPending || isSubmitting ? (
                  <Loader className="animate-spin" />
                ) : (
                  <Plus />
                )}
                Create Board
              </Button>
            )}
          </form.Subscribe>
        </form>
      </div>
    </div>
  );
}
