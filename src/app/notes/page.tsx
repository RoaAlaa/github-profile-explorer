import Link from "next/link";
import { getAllNotes } from "@/lib/notes";
import PageShell from "@/components/PageShell";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const notes = await getAllNotes();

  return (
    <PageShell
      title="All notes"
      description="Notes you've saved across profiles and repositories."
    >
      {notes.length === 0 ? (
        <p className="text-sm text-gray-500">No notes yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-800 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          {notes.map((note) => (
            <li key={note.id} className="p-4 first:rounded-t-xl last:rounded-b-xl">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                <Link
                  href={`/user/${note.username}`}
                  className="font-medium hover:underline"
                >
                  {note.username}
                </Link>
                {note.repoName && (
                  <>
                    <span className="text-gray-400">/</span>
                    <Link
                      href={`/user/${note.username}/${note.repoName}`}
                      className="font-medium hover:underline"
                    >
                      {note.repoName}
                    </Link>
                  </>
                )}
                {!note.repoName && (
                  <span className="text-xs text-gray-400">profile</span>
                )}
              </div>
              <p className="mt-2 text-sm leading-relaxed">{note.content}</p>
              <p className="mt-1 text-xs text-gray-400">
                {new Date(note.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
