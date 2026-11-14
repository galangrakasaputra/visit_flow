import { useEffect, useState } from "react";

import DashboardHeader from "../components/Home/DashboardHeader";
import DashboardSummary from "../components/Home/DashboardSummary";

import { getDashboardData } from "../api/HomeApi";

function Home() {
  const [totalEntitas, setTotalEntitas] = useState(0);
  const [totalKunjungan, setTotalKunjungan] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getDashboardData();

        setTotalEntitas(result.totalEntitas);
        setTotalKunjungan(result.totalKunjungan);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Gagal mengambil data dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-6 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <DashboardHeader />

        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="text-sm font-semibold text-red-700 hover:underline"
            >
              Coba Lagi
            </button>
          </div>
        )}

        <DashboardSummary
          totalEntitas={totalEntitas}
          totalKunjungan={totalKunjungan}
          loading={loading}
        />
      </div>
    </main>
  );
}

export default Home;