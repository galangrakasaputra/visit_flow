
import { apiRequest } from "./ApiClient";

export type Kunjungan = {
  id: number;
  entitas_id: number;
  user_id: number;
  visit_date: string;
  status: boolean;
  entitas: {
    id: number;
    name: string;
    type: string;
    segment: string;
    region: string;
  };
};

export type KunjunganPayload = {
  entitas_id: number;
  visit_date: string;
  status?: boolean;
};

export type KunjunganFilters = {
  name?: string;
  segment?: string;
  status?: string;
  tanggal_mulai?: string;
  tanggal_akhir?: string;
};

type KunjunganResponse = {
  data: Kunjungan[];
};

type MessageResponse = {
  message: string;
};

export async function getKunjungan(
  filters?: KunjunganFilters
): Promise<Kunjungan[]> {
  const params = new URLSearchParams();

  if (filters?.name) params.append("name", filters.name);
  if (filters?.segment) params.append("segment", filters.segment);

  // Gunakan "0" dan "1" agar sesuai dengan validasi boolean Laravel.
  if (filters?.status !== undefined && filters.status !== "") {
    params.append("status", filters.status);
  }

  if (filters?.tanggal_mulai) {
    params.append("tanggal_mulai", filters.tanggal_mulai);
  }

  if (filters?.tanggal_akhir) {
    params.append("tanggal_akhir", filters.tanggal_akhir);
  }

  const query = params.toString();
  const endpoint = query ? `/kunjungan/search?${query}` : "/kunjungan";

  const response: KunjunganResponse = await apiRequest(endpoint);
  return response.data;
}

export async function createKunjungan(
  payload: KunjunganPayload
): Promise<MessageResponse> {
  return apiRequest("/kunjungan", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateKunjungan(
  id: number,
  payload: KunjunganPayload
): Promise<MessageResponse> {
  return apiRequest(`/kunjungan/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function updateStatusKunjungan(
  id: number,
  status: boolean
): Promise<MessageResponse> {
  return apiRequest(`/kunjungan/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export async function deleteKunjungan(
  id: number
): Promise<MessageResponse> {
  return apiRequest(`/kunjungan/${id}`, {
    method: "DELETE",
  });
}
