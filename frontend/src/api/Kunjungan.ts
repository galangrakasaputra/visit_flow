import { apiRequest } from "./ApiClient";

export async function getKunjungan() {
  return apiRequest("/kunjungan");
}