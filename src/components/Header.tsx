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
import { Plus } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  const { data: session } = authClient.useSession();

  return (
    <header className="container mx-auto flex flex-row justify-between pt-4 pb-2">
      <Link to="/" className="text-lg font-semibold">
        Gitboard
      </Link>

      <div className="flex flex-row gap-3">
        <ThemeToggle />
        <AuthLoading>
          <Skeleton className="border w-30 h-8 rounded-md" />
          <Skeleton className="border rounded-full size-8" />
        </AuthLoading>

        <Unauthenticated>
          <Button onClick={signIn}>Sign In</Button>
        </Unauthenticated>

        <Authenticated>
          <Link
            to="/create"
            className={buttonVariants({ size: "sm", variant: "outline" })}
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
