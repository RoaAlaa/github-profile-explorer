import Link from "next/link";

export default function PageShell({
  title,
  description,
  children,
  showBack = true,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  showBack?: boolean;
}) {
  return (
    <main className="min-h-full flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        {showBack && (
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            ← Back
          </Link>
        )}

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>

        {children}
      </div>
    </main>
  );
}
