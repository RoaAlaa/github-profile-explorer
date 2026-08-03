import PageShell from "@/components/PageShell";
import CompareForm from "@/components/CompareForm";

export default function ComparePage() {
  return (
    <PageShell
      title="Compare profiles"
      description="Enter two GitHub usernames to compare their stats side by side."
    >
      <CompareForm />
    </PageShell>
  );
}
