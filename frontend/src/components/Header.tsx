export default function Header() {
  return (
    <section
      id="dashboard"
      className="scroll-mt-20 flex justify-between items-center mb-8"
    >
      <div>
        <h2 className="text-3xl font-bold">Enterprise AI Command Center</h2>

        <p className="text-gray-500">
          Autonomous operational intelligence platform
        </p>
      </div>

      <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg">
        System Online
      </div>
    </section>
  );
}
