import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { Plus, GitBranch, Calendar } from "lucide-react";

interface RecentBoardsGridProps {
  limit?: number;
}

export function RecentBoardsGrid({ limit = 6 }: RecentBoardsGridProps) {
  const { data: boards } = useSuspenseQuery(
    convexQuery(api.boards.getRecentBoards, { limit }),
  );

  if (!boards || boards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No boards created yet</p>
        <Button asChild>
          <Link to="/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Board
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {boards.map((board) => {
        const [owner, name] = board.repo.split("/");
        return (
          <Link key={board._id} to="/$owner/$name" params={{ owner, name }}>
            <Card className="h-full cursor-pointer transition-all duration-200 border-border/50 hover:border-primary/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold leading-tight">
                  {board.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-1.5 text-sm">
                  <GitBranch className="h-3.5 w-3.5" />
                  {board.repo}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {board.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                    {board.description}
                  </p>
                )}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-auto">
                  <Calendar className="h-3 w-3" />
                  {new Date(board.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
