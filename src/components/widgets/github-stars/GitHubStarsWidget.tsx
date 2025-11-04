import { WidgetRoot } from "../WidgetRoot";

const config = {
  repository: "hello/world",
  showIcon: true,
};

export function GitHubStarsWidget() {
  const starCount = 1337;
  const repoName = config.repository || "example/repo";

  return (
    <WidgetRoot title="GitHub Stars">
      <div className="flex items-center gap-3">
        {config.showIcon && <div className="text-2xl">⭐</div>}
        <div>
          <div className="text-2xl font-bold">{starCount.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">{repoName}</div>
        </div>
      </div>
    </WidgetRoot>
  );
}
