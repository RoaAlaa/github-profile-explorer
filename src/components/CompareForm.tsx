"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CompareForm() {
  const [username1, setUsername1] = useState("");
  const [username2, setUsername2] = useState("");
  const router = useRouter();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const userA = username1.trim();
    const userB = username2.trim();
    if (!userA || !userB) return;
    router.push(`/compare/${userA}/${userB}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="First username"
        value={username1}
        onChange={(e) => setUsername1(e.target.value)}
        className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-2.5 text-sm outline-none focus:border-gray-400 dark:focus:border-gray-600"
        autoFocus
      />
      <input
        type="text"
        placeholder="Second username"
        value={username2}
        onChange={(e) => setUsername2(e.target.value)}
        className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-2.5 text-sm outline-none focus:border-gray-400 dark:focus:border-gray-600"
      />
      <button
        type="submit"
        className="w-full rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 py-2.5 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
      >
        Compare
      </button>
    </form>
  );
}
