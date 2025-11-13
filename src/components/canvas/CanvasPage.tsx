import { Github } from "lucide-react";
import { CanvasContainer } from "./CanvasContainer";
import { CanvasProvider } from "./CanvasContext";
import { CanvasControls } from "./CanvasControls";
import { CanvasToolbar } from "./CanvasToolbar";
import { Doc } from "convex/_generated/dataModel";
import { buttonVariants } from "../ui/button";

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
      <nav className="py-4 flex flex-row justify-center items-center w-fit mx-auto relative z-20">
        <a
          href={`https://github.com/${repoString}`}
          className={`${buttonVariants()} !rounded group shadow-lg`}
          target="_blank"
        >
          <Github className="size-4 text-primary-foreground/50 group-hover:text-primary-foreground/80 transition-all" />
          {repoString}
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
