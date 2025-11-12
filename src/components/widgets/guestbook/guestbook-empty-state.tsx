export function GuestbookEmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
      <h3 className="font-medium mb-2">No comments yet</h3>
      <p className="text-sm text-muted-foreground">
        Be the first to sign this guestbook!
      </p>
    </div>
  );
}

