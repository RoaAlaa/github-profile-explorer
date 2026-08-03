"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserSearchForm() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/user/${username}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter GitHub username"
      />
      <button type="submit">Search</button>
    </form>
  );
}