import { Github } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { CanvasContainer } from "./CanvasContainer";
import { CanvasProvider } from "./CanvasContext";
import { CanvasControls } from "./CanvasControls";
import { CanvasToolbar } from "./CanvasToolbar";
import { Doc } from "convex/_generated/dataModel";

export function CanvasPage({
  owner,
  name,
  board,
  hasWriteAccess,
}: {
  owner: string;
  name: string;
  board: Doc<"boards">;
  hasWriteAccess: boolean;
}) {
  const repoString = `${owner}/${name}`;

  return (
    <CanvasProvider
      boardId={board._id}
      repoString={repoString}
      hasWriteAccess={hasWriteAccess}
    >
      <nav className="py-3 flex flex-row justify-between container mx-auto relative z-10">
        <a href={`https://github.com/${repoString}`} target="_blank">
          <Card className="py-2 group hover:border-primary/40 transition-all">
            <CardContent className="flex flex-row items-center gap-2 text-sm px-3">
              <Github className="size-4 text-muted-foreground/70 group-hover:text-primary transition-all" />
              <h1 className="font-semibold">{repoString}</h1>
            </CardContent>
          </Card>
        </a>


      </nav>

      <main>
        <CanvasContainer />
        <CanvasControls />
        <CanvasToolbar />
      </main>
    </CanvasProvider>
  );
}
