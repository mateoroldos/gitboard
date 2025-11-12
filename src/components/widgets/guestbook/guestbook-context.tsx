import { createContext, useContext, useState, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { usePaginatedQuery, useAction } from "convex/react";
import { api } from "convex/_generated/api";
import type { WidgetInstance } from "../types";
import type {
  GuestbookComment,
  UserCommentStatus,
  GuestbookConfig,
} from "./types";
import { useInfiniteScroll } from "./useInfiniteScroll";

export interface GuestbookContextValue {
  comments: GuestbookComment[] | undefined;
  userStatus: UserCommentStatus | null;
  isModalOpen: boolean;
  isSubmitting: boolean;
  isEditing: boolean;
  isLoading: boolean;
  status: "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted";
  loadMoreRef: (node?: Element | null) => void;
  actions: {
    openModal: () => void;
    closeModal: () => void;
    addComment: (comment: string) => void;
  };
}

export const GuestbookContext = createContext<GuestbookContextValue | null>(
  null,
);

interface GuestbookProviderProps {
  children: ReactNode;
  widget: WidgetInstance<GuestbookConfig>;
  isEditing?: boolean;
}

export function GuestbookProvider({
  children,
  widget,
  isEditing = false,
}: GuestbookProviderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.guestbook.getComments,
    { widgetId: widget._id },
    { initialNumItems: 20 },
  );

  const { data: userStatus } = useQuery({
    ...convexQuery(api.guestbook.checkUserCanComment, { widgetId: widget._id }),
    enabled: !isEditing,
  });

  const addCommentAction = useAction(api.guestbook.addComment);

  const addCommentMutation = useMutation({
    mutationFn: addCommentAction,
  });

  const loadMoreRef = useInfiniteScroll({
    hasNextPage: status === "CanLoadMore",
    isFetchingNextPage: status === "LoadingMore",
    fetchNextPage: () => loadMore(20),
  });

  const actions = {
    openModal: () => {
      if (!isEditing) {
        setIsModalOpen(true);
      }
    },
    closeModal: () => {
      setIsModalOpen(false);
    },
    addComment: (comment: string) => {
      if (!isEditing && userStatus?.canComment) {
        addCommentMutation.mutate({
          widgetId: widget._id,
          comment,
        });
      }
    },
  };

  const contextValue: GuestbookContextValue = {
    comments: results,
    userStatus: userStatus as UserCommentStatus | null,
    isModalOpen,
    isSubmitting: addCommentMutation.isPending,
    isEditing,
    isLoading,
    status,
    loadMoreRef,
    actions,
  };

  return (
    <GuestbookContext.Provider value={contextValue}>
      {children}
    </GuestbookContext.Provider>
  );
}

export function useGuestbook() {
  const context = useContext(GuestbookContext);
  if (!context) {
    throw new Error("useGuestbook must be used within a GuestbookProvider");
  }
  return context;
}

export function useGuestbookActions() {
  const { actions } = useGuestbook();
  return actions;
}
