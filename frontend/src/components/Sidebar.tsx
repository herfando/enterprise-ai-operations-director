export default function Sidebar() {
  return (
    <aside className="sticky top-0 h-screen w-64 bg-slate-900 text-white p-6">
      <h1 className="text-xl font-bold mb-8">AI Operations Director</h1>

      <nav className="space-y-4 flex flex-col">
        <a href="#dashboard" className="hover:text-blue-400 cursor-pointer">
          Dashboard
        </a>

        <a href="#departments" className="hover:text-blue-400 cursor-pointer">
          Departments
        </a>

        <a href="#analytics" className="hover:text-blue-400 cursor-pointer">
          Analytics
        </a>
        <a href="#ai-decisions" className="hover:text-blue-400 cursor-pointer">
          AI Decisions
        </a>

        <a href="#workflows" className="hover:text-blue-400 cursor-pointer">
          Workflows
        </a>
      </nav>
    </aside>
  );
}
