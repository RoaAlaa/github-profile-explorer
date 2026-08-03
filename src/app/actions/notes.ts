"use server";

import { addNote } from "@/lib/notes";
import { revalidatePath } from "next/cache";

export async function createNoteAction(formData: FormData) {
  const username = formData.get("username") as string;
  const repoName = formData.get("repoName") as string | null;
  const content = formData.get("content") as string;

  await addNote(username, content, repoName || undefined);

  const path = repoName
    ? `/user/${username}/${repoName}`
    : `/user/${username}`;
  revalidatePath(path);
  revalidatePath("/notes");
}