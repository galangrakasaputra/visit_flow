import { apiRequest } from "./ApiClient";

export type Entitas = {
  id: number;
  name: string;
  type: string;
  segment: string;
  region: string;
};

export type EntitasPayload = {
  name: string;
  type: string;
  segment: string;
  region: string;
};

export type ApiResponse<T = null> = {
  status?: "success" | "error";
  message: string;
  data?: T;
};
export async function getEntitas(): Promise<Entitas[]> {
  const response = await apiRequest("/entitas");
  return response.data;
}

export async function createEntitas(
  payload: EntitasPayload
): Promise<ApiResponse<Entitas>> {
  return apiRequest("/entitas", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateEntitas(
  id: number,
  payload: EntitasPayload
): Promise<ApiResponse<Entitas>> {
  return apiRequest(`/entitas/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteEntitas(
  id: number
): Promise<ApiResponse> {
  return apiRequest(`/entitas/${id}`, {
    method: "DELETE",
  });
}