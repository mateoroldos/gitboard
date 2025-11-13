import { useSuspenseQuery } from "@tanstack/react-query";
import { convexAction } from "@convex-dev/react-query";
import { parseRepoString } from "@/lib/github";
import { api } from "convex/_generated/api";
import { Star } from "lucide-react";
import { useWidget } from "../widget/WidgetProvider";

export function GitHubStarsWidget() {
  const { widget, repository } = useWidget();

  const { owner, name } = parseRepoString(repository);

  const { data: starsData } = useSuspenseQuery(
    convexAction(api.github.getRepoStars, { owner, name }),
  );

  const starCount = starsData?.stars ?? 0;

  return (
    <div className="flex flex-1 items-center gap-3">
      {widget.config.showIcon && (
        <div className="text-2xl">
          <Star className="fill-amber-200 stroke-amber-300" />
        </div>
      )}
      <div>
        <div className="text-2xl font-bold">{starCount.toLocaleString()}</div>
        <div className="text-sm text-muted-foreground">{repository}</div>
      </div>
    </div>
  );
}
