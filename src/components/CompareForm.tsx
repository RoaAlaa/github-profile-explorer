"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function CompareForm() {
  const [username1, setUsername1] = useState("");
  const [username2, setUsername2] = useState("");
  const router = useRouter();
  
  function handleSubmit(event: React.FormEvent) {
  event.preventDefault();
  if (!username1.trim() || !username2.trim()) return;
  router.push(`/compare/${username1.trim()}/${username2.trim()}`);
}
 

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Enter first GitHub username"
        value={username1}
        onChange={(e) => setUsername1(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Enter second GitHub username"
        value={username2}
        onChange={(e) => setUsername2(e.target.value)}
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-black text-white p-2 rounded">
        Compare
      </button>
    </form>
  );
}