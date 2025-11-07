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

export function Header() {
  const { data: session } = authClient.useSession();

  return (
    <header className="container mx-auto flex flex-row justify-between pt-4 pb-2">
      <Link to="/" className="text-lg font-semibold">
        Gitboard
      </Link>

      <AuthLoading>
        <div className="flex flex-row gap-3">
          <Skeleton className="w-24 h-8 rounded-md" />
          <Skeleton className="rounded-full size-8" />
        </div>
      </AuthLoading>

      <Unauthenticated>
        <Button onClick={signIn}>Sign In</Button>
      </Unauthenticated>

      <Authenticated>
        <div className="flex flex-row gap-3">
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
        </div>
      </Authenticated>
    </header>
  );
}
