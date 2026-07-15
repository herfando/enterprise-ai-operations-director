export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-xl font-bold mb-8">AI Operations Director</h1>

      <nav className="space-y-4">
        <p className="hover:text-blue-400 cursor-pointer">Dashboard</p>

        <p className="hover:text-blue-400 cursor-pointer">Departments</p>

        <p className="hover:text-blue-400 cursor-pointer">AI Decisions</p>

        <p className="hover:text-blue-400 cursor-pointer">Workflows</p>

        <p className="hover:text-blue-400 cursor-pointer">Analytics</p>
      </nav>
    </aside>
  );
}
