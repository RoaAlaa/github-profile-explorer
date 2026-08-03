import { getProfileNotes, getRepoNotes } from "@/lib/notes";
import { createNoteAction } from "@/app/actions/notes";

const cardClass =
  "rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6";

const inputClass =
  "flex-1 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-2.5 text-sm outline-none focus:border-gray-400 dark:focus:border-gray-600";

const buttonClass =
  "shrink-0 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2.5 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors";

export default async function NotesSection({
  username,
  repoName,
}: {
  username: string;
  repoName?: string;
}) {
  const notes = repoName
    ? await getRepoNotes(username, repoName)
    : await getProfileNotes(username);

  return (
    <section className={cardClass}>
      <h2 className="text-lg font-medium mb-4">
        Notes{repoName ? ` on ${repoName}` : ""}
      </h2>

      <form action={createNoteAction} className="flex gap-2 mb-4">
        <input type="hidden" name="username" value={username} />
        {repoName && <input type="hidden" name="repoName" value={repoName} />}
        <input
          name="content"
          placeholder="Add a note..."
          required
          className={inputClass}
        />
        <button type="submit" className={buttonClass}>
          Add
        </button>
      </form>

      {notes.length === 0 ? (
        <p className="text-sm text-gray-500">No notes yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-800">
          {notes.map((note) => (
            <li key={note.id} className="py-3 first:pt-0 last:pb-0">
              <p className="text-sm leading-relaxed">{note.content}</p>
              <p className="mt-1 text-xs text-gray-400">
                {new Date(note.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
