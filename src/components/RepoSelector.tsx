import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, GitBranch, Lock, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { convexAction } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";

interface RepoSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function RepoSelector({
  value,
  onValueChange,
  placeholder = "Select repository...",
}: RepoSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { data: githubData } = useSuspenseQuery(
    convexAction(api.github.getAllRepos, {}),
  );

  const userRepos = githubData?.userRepos || [];
  const orgRepos = githubData?.orgRepos || [];
  const organizations = githubData?.organizations || [];

  const allRepos = [...userRepos, ...orgRepos];

  const filteredRepos = allRepos.filter(
    (repo) =>
      repo.full_name.toLowerCase().includes(searchValue.toLowerCase()) ||
      repo.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const isValidRepoFormat = (input: string) => {
    return /^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/.test(input);
  };

  const groupedRepos = {
    personal: filteredRepos.filter((repo) =>
      userRepos.some((ur) => ur.id === repo.id),
    ),
    organizations: organizations.reduce(
      (acc, org) => {
        const repos = filteredRepos.filter(
          (repo) => repo.owner.login === org.login,
        );
        if (repos.length > 0) {
          acc[org.login] = repos;
        }
        return acc;
      },
      {} as Record<string, typeof orgRepos>,
    ),
  };
  const selectedRepo = allRepos.find((repo) => repo.full_name === value);
  const isManualEntry = value && !selectedRepo && isValidRepoFormat(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedRepo ? (
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              <span className="truncate">{selectedRepo.full_name}</span>
              {selectedRepo.private && <Lock className="h-3 w-3" />}
            </div>
          ) : isManualEntry ? (
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              <span className="truncate">{value}</span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full max-w-sm p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search repositories or type owner/repo..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            {filteredRepos.length === 0 && !isValidRepoFormat(searchValue) ? (
              <CommandEmpty>
                No repositories found. Try typing owner/repo to add manually.
              </CommandEmpty>
            ) : filteredRepos.length === 0 && isValidRepoFormat(searchValue) ? (
              <CommandGroup heading="Manual entry">
                <CommandItem
                  value={searchValue}
                  onSelect={() => {
                    onValueChange(searchValue);
                    setOpen(false);
                    setSearchValue("");
                  }}
                >
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    <span>Add repository: {searchValue}</span>
                  </div>
                </CommandItem>
              </CommandGroup>
            ) : (
              <>
                {groupedRepos.personal.length > 0 && (
                  <CommandGroup heading="Your repositories">
                    {groupedRepos.personal.map((repo) => (
                      <CommandItem
                        key={repo.id}
                        value={repo.full_name}
                        onSelect={(currentValue) => {
                          onValueChange(
                            currentValue === value ? "" : currentValue,
                          );
                          setOpen(false);
                        }}
                      >
                        <div className="flex items-center justify-between gap-2 flex-1 min-w-0">
                          <div className="flex-1 min-w-0">
                            <div className="flex gap-2">
                              <span className="truncate font-medium">
                                {repo.full_name}
                              </span>
                            </div>
                            {repo.description && (
                              <p className="text-xs text-muted-foreground truncate">
                                {repo.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                            <Star className="h-3 w-3" />
                            {repo.stargazers_count}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {Object.entries(groupedRepos.organizations).map(
                  ([orgName, repos]) => (
                    <CommandGroup
                      key={orgName}
                      heading={`${orgName} repositories`}
                    >
                      {repos.map((repo) => (
                        <CommandItem
                          key={repo.id}
                          value={repo.full_name}
                          onSelect={(currentValue) => {
                            onValueChange(
                              currentValue === value ? "" : currentValue,
                            );
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === repo.full_name
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <GitBranch className="h-4 w-4 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="truncate font-medium">
                                  {repo.name}
                                </span>
                                {repo.private && (
                                  <Lock className="h-3 w-3 shrink-0" />
                                )}
                              </div>
                              {repo.description && (
                                <p className="text-xs text-muted-foreground truncate">
                                  {repo.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                              <Star className="h-3 w-3" />
                              {repo.stargazers_count}
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ),
                )}

                {isValidRepoFormat(searchValue) &&
                  !filteredRepos.find(
                    (repo) => repo.full_name === searchValue,
                  ) && (
                    <CommandGroup heading="Manual entry">
                      <CommandItem
                        value={searchValue}
                        onSelect={() => {
                          onValueChange(searchValue);
                          setOpen(false);
                          setSearchValue("");
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <GitBranch className="h-4 w-4" />
                          <span>Add repository: {searchValue}</span>
                        </div>
                      </CommandItem>
                    </CommandGroup>
                  )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
