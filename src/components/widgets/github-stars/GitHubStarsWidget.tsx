import type { WidgetProps } from "../types";
import { WidgetRoot } from "../WidgetRoot";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexAction } from "@convex-dev/react-query";
import { parseRepoString } from "@/lib/github";
import { api } from "convex/_generated/api";

interface GitHubStarsConfig {
  repository: string;
  showIcon: boolean;
  theme: "light" | "dark";
}

export function GitHubStarsWidget({
  widget,
  repository,
  onConfigChange,
  onDelete,
}: WidgetProps<GitHubStarsConfig>) {
  const { owner, name } = parseRepoString(repository);

  const { data: starsData } = useSuspenseQuery(
    convexAction(api.github.getRepoStars, { owner, name }),
  );

  const starCount = starsData?.stars ?? 0;

  return (
    <WidgetRoot
      widget={widget}
      onEdit={onConfigChange ? () => onConfigChange(widget.config) : undefined}
      onDelete={onDelete}
    >
      <div className="flex items-center gap-3">
        {widget.config.showIcon && <div className="text-2xl">⭐</div>}
        <div>
          <div className="text-2xl font-bold">{starCount.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">{repository}</div>
        </div>
      </div>
    </WidgetRoot>
  );
}
