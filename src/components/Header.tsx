import { Link } from "@tanstack/react-router";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { Button, buttonVariants } from "./ui/button";
import { authClient, signIn, signOut } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Github, LayoutDashboard, Plus, Star } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useGitHubStars } from "@/hooks/useGitHubStars";

export function Header() {
  const { data: session } = authClient.useSession();
  const { stars } = useGitHubStars("mateoroldos", "gitboard");

  return (
    <header className="fixed flex flex-row justify-between pt-4 pb-2 z-20 px-5 w-full">
      <div className="flex items-center gap-2">
        <Link
          to="/"
          className={`${buttonVariants({ variant: "outline" })} !rounded`}
        >
          <LayoutDashboard />
          GitBoard
        </Link>
        {stars !== null && (
          <a
            href="https://github.com/mateoroldos/gitboard"
            className={`${buttonVariants({ variant: "outline" })} !rounded group`}
          >
            <Star className="transition group-hover:fill-amber-200 group-hover:stroke-amber-300" />
            {stars.toLocaleString()}
          </a>
        )}
      </div>

      <div className="flex flex-row gap-3">
        <ThemeToggle />
        <AuthLoading>
          <Skeleton className="border w-30 h-8 rounded-md" />
          <Skeleton className="border rounded-full size-8" />
        </AuthLoading>

        <Unauthenticated>
          <Button onClick={signIn} size="sm" className="rounded">
            <Github />
            Sign In
          </Button>
        </Unauthenticated>

        <Authenticated>
          <Link
            to="/create"
            className={`!rounded ${buttonVariants({ size: "sm", variant: "outline" })}`}
          >
            <Plus />
            New Board
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage
                  src={session?.user.image ?? undefined}
                  alt={session?.user.name}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={signOut}>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Authenticated>
      </div>
    </header>
  );
}
