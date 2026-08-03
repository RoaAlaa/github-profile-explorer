export default function NotFound() {
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-semibold">User not found</h2>
      <p className="text-gray-500 mt-2">
        No GitHub user exists with that username. Double check the spelling and try again.
      </p>
    </div>
  );
}