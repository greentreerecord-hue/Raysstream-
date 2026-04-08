"use client";

import { useState, useTransition } from "react";
import { createComment } from "@/app/actions/comments";

export function CommentForm({ videoId, slug }: { videoId: string; slug: string }) {
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Add a comment"
        className="min-h-28 w-full rounded-2xl border border-white/10 bg-zinc-900 p-3 text-white outline-none"
      />
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      <div className="mt-3 flex justify-end">
        <button
          disabled={pending}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              try {
                await createComment(videoId, body, slug);
                setBody("");
              } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to post comment");
              }
            });
          }}
          className="rounded-2xl bg-white px-4 py-2 font-medium text-zinc-950 disabled:opacity-50"
        >
          {pending ? "Posting..." : "Post Comment"}
        </button>
      </div>
    </div>
  );
}
