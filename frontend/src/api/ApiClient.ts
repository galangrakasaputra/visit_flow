import { getToken, removeToken } from "../utils/AuthStorage";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
  });

  if (response.status === 401) {
    removeToken();
    window.location.href = "/login";
    throw new Error("Sesi login telah berakhir. Silakan login kembali.");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Terjadi kesalahan pada API.");
  }

  return data;
}