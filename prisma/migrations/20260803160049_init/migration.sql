-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "repoName" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Note_username_repoName_idx" ON "Note"("username", "repoName");
