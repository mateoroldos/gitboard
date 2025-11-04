import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { validateRepoString } from "@/lib/github";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  const [repoInput, setRepoInput] = useState("");
  const [error, setError] = useState("");

  const createBoard = useMutation(api.boards.createBoard);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!repoInput.trim()) {
      setError("Please enter a repository");
      return;
    }

    if (!validateRepoString(repoInput.trim())) {
      setError("Please enter a valid repository format (owner/name)");
      return;
    }

    const [owner, name] = repoInput.trim().split("/");

    await createBoard({
      name,
      repo: name,
    });

    window.location.href = `/${owner}/${name}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">GitBoard</h1>
          <p className="text-lg text-gray-600">
            The open source canvas for open source projects
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="repo"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              GitHub Repository
            </label>
            <input
              id="repo"
              type="text"
              value={repoInput}
              onChange={(e) => {
                setRepoInput(e.target.value);
                setError("");
              }}
              placeholder="facebook/react"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Create Board
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Enter any public GitHub repository to get started
          </p>
        </div>
      </div>
    </div>
  );
}
