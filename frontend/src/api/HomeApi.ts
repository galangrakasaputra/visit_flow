import { apiRequest } from "./ApiClient";

export type DashboardResponse = {
  status: "success" | "error";
  message: string;
  data: number;
};

export type DashboardData = {
  totalEntitas: number;
  totalKunjungan: number;
};

async function getTotal(endpoint: string): Promise<number> {
  const result: DashboardResponse = await apiRequest(endpoint);

  if (result.status === "error") {
    throw new Error(result.message);
  }

  return result.data;
}

export async function getDashboardData(): Promise<DashboardData> {
  const [totalEntitas, totalKunjungan] = await Promise.all([
    getTotal("/countEntitas"),
    getTotal("/countKunjungan"),
  ]);

  return {
    totalEntitas,
    totalKunjungan,
  };
}