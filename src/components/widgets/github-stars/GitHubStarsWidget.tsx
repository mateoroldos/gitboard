import type { WidgetProps } from "../types";
import { WidgetRoot } from "../WidgetRoot";

interface GitHubStarsConfig {
  repository: string;
  showIcon: boolean;
  theme: "light" | "dark";
}

export function GitHubStarsWidget({
  config,
  repository,
  onConfigChange,
  onDelete,
}: WidgetProps<GitHubStarsConfig>) {
  const starCount = 1337;

  return (
    <WidgetRoot
      title="GitHub Stars"
      onEdit={onConfigChange ? () => {} : undefined}
      onDelete={onDelete}
    >
      <div className="flex items-center gap-3">
        {config.showIcon && <div className="text-2xl">⭐</div>}
        <div>
          <div className="text-2xl font-bold">{starCount.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">{repository}</div>
        </div>
      </div>
    </WidgetRoot>
  );
}
