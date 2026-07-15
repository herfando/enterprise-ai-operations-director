type Props = {
  name: string;
  status: string;
  risk: string;
};

export default function DepartmentCard({ name, status, risk }: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h3 className="font-bold">{name}</h3>

      <p className="mt-3">
        Status:
        <span className="ml-2 font-semibold">{status}</span>
      </p>

      <p>
        Risk:
        <span className="ml-2">{risk}</span>
      </p>
    </div>
  );
}
