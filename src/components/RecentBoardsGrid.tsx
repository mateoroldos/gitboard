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
import { Plus } from "lucide-react";

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
          <Card key={board._id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{board.name}</CardTitle>
              <CardDescription>{board.repo}</CardDescription>
            </CardHeader>
            <CardContent>
              {board.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {board.description}
                </p>
              )}
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {new Date(board.createdAt).toLocaleDateString()}
                </span>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/$owner/$name" params={{ owner, name }}>
                    View Board
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

