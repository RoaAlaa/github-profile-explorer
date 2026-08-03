"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserSearchForm() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;
    router.push(`/user/${trimmed}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="GitHub username"
        className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-2.5 text-sm outline-none focus:border-gray-400 dark:focus:border-gray-600"
        autoFocus
      />
      <button
        type="submit"
        className="w-full rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 py-2.5 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
      >
        Search
      </button>
    </form>
  );
}
