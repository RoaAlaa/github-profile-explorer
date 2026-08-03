import Link from "next/link";
import UserSearchForm from "@/components/UserSearchForm";

export default function HomePage() {
  return (
    <main className="min-h-full flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-10 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            GitHub Profile Explorer
          </h1>
          <p className="text-gray-500">
            Search a developer or compare two profiles.
          </p>
        </div>

        <UserSearchForm />

        <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
          <Link
            href="/compare"
            className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-2 font-medium transition-colors hover:border-gray-400 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            Compare profiles
          </Link>
          <Link
            href="/notes"
            className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-2 font-medium transition-colors hover:border-gray-400 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            All notes
          </Link>
        </div>
      </div>
    </main>
  );
}
