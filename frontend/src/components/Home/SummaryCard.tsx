type SummaryCardProps = {
  title: string;
  total: number;
  description: string;
  icon: React.ReactNode;
  loading?: boolean;
};

function SummaryCard({
  title,
  total,
  description,
  icon,
  loading = false,
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-gray-900">
            {loading ? "..." : total.toLocaleString("id-ID")}
          </h2>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>
      </div>

      <p className="mt-5 text-xs text-gray-500">
        {description}
      </p>
    </div>
  );
}

export default SummaryCard;