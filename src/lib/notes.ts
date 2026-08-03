import { prisma } from "@/lib/prisma";

export async function getAllNotes() {
  return prisma.note.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getProfileNotes(username: string) {
  return prisma.note.findMany({
    where: { username, repoName: null },
    orderBy: { createdAt: "desc" },
  });
}

export async function getRepoNotes(username: string, repoName: string) {
  return prisma.note.findMany({
    where: { username, repoName },
    orderBy: { createdAt: "desc" },
  });
}

export async function addNote(
  username: string,
  content: string,
  repoName?: string
) {
  if (!content.trim()) throw new Error("Note content cannot be empty");

  return prisma.note.create({
    data: { username, repoName: repoName ?? null, content: content.trim() },
  });
}