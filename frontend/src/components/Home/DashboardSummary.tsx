import { Building2, CalendarCheck } from "lucide-react";

import SummaryCard from "./SummaryCard";

type DashboardSummaryProps = {
  totalEntitas: number;
  totalKunjungan: number;
  loading: boolean;
};

function DashboardSummary({
  totalEntitas,
  totalKunjungan,
  loading,
}: DashboardSummaryProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <SummaryCard
        title="Total Entitas"
        total={totalEntitas}
        description="Jumlah seluruh entitas yang terdaftar."
        loading={loading}
        icon={<Building2 size={24} />}
      />

      <SummaryCard
        title="Total Kunjungan"
        total={totalKunjungan}
        description="Jumlah seluruh kunjungan yang tercatat."
        loading={loading}
        icon={<CalendarCheck size={24} />}
      />
    </div>
  );
}

export default DashboardSummary;