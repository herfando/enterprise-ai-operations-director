export default function DecisionPanel() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold">AI Decision Center</h2>

      <div className="mt-4">
        <p>Problem:</p>

        <h3 className="font-bold">Production Reject Increased</h3>

        <p className="mt-4">AI Finding:</p>

        <ul className="list-disc ml-5">
          <li>QCQA detected defect pattern</li>

          <li>Maintenance found cooling instability</li>

          <li>Finance estimated production loss</li>
        </ul>

        <button className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg">
          Approve Action
        </button>
      </div>
    </div>
  );
}
