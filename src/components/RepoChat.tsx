"use client";

import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  id?: string;
  role: "user" | "assistant";
  content: string;
};

const cardClass =
  "rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6";

const inputClass =
  "flex-1 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-2.5 text-sm outline-none focus:border-gray-400 dark:focus:border-gray-600 disabled:opacity-50";

const buttonClass =
  "shrink-0 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2.5 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors disabled:opacity-50";

export default function RepoChat({
  username,
  repoName,
}: {
  username: string;
  repoName: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      setIsLoadingHistory(true);
      try {
        const res = await fetch(
          `/api/repo-chat?username=${encodeURIComponent(username)}&repoName=${encodeURIComponent(repoName)}`
        );
        if (!res.ok) throw new Error("Failed to load chat history");
        const data = await res.json();
        if (!cancelled) setMessages(data.messages ?? []);
      } catch {
        if (!cancelled) setError("Couldn't load previous conversation.");
      } finally {
        if (!cancelled) setIsLoadingHistory(false);
      }
    }

    loadHistory();
    return () => {
      cancelled = true;
    };
  }, [username, repoName]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    setError(null);
    setInput("");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: trimmed },
      { role: "assistant", content: "" },
    ]);
    setIsStreaming(true);

    try {
      const res = await fetch("/api/repo-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, repoName, message: trimmed }),
      });

      if (!res.ok || !res.body) {
        throw new Error("Chat request failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          next[next.length - 1] = { ...last, content: last.content + chunk };
          return next;
        });
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <section className={cardClass}>
      <h2 className="text-lg font-medium mb-4">Ask about this repo</h2>

      <div className="space-y-3 max-h-96 overflow-y-auto mb-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-4">
        {isLoadingHistory && (
          <p className="text-sm text-gray-500">Loading conversation…</p>
        )}

        {!isLoadingHistory && messages.length === 0 && (
          <p className="text-sm text-gray-500">
            Ask a question about the README, structure, or recent commits.
          </p>
        )}

        {messages.map((m, i) => (
          <div
            key={m.id ?? i}
            className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
          >
            <span
              className={`inline-block max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed whitespace-pre-line ${
                m.role === "user"
                  ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                  : "bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-800"
              }`}
            >
              {m.content || (isStreaming && i === messages.length - 1 ? "…" : "")}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="e.g. What does this repo do?"
          disabled={isStreaming}
          className={inputClass}
        />
        <button
          onClick={sendMessage}
          disabled={isStreaming || !input.trim()}
          className={buttonClass}
        >
          {isStreaming ? "…" : "Send"}
        </button>
      </div>
    </section>
  );
}
