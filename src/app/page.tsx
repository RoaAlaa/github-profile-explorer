import UserSearchForm from "@/components/UserSearchForm";
import CompareForm from "@/components/CompareForm";

export default function HomePage() {
  return (
    <main className="max-w-2xl mx-auto p-8 space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">GitHub Profile Explorer</h1>
        <p className="text-gray-500">Search a profile, or compare two side by side.</p>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-3">Search a profile</h2>
        <UserSearchForm />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Compare two users</h2>
        <CompareForm />
      </section>
    </main>
  );
}