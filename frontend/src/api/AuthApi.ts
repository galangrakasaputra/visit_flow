// URL API masing-masing
const API_LOGIN = "http://127.0.0.1:8000/api/login";
const API_REGISTER = "http://127.0.0.1:8000/api/register";
const API_LOGOUT = "http://127.0.0.1:8000/api/logout";

export type LoginPayload = {
  email: string;
  password: string;
};

export type ApiResponse = {
  status: "success" | "error";
  message: string;
  access_token? : string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

async function request(
  url: string,
  payload: LoginPayload | RegisterPayload
): Promise<ApiResponse> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data: ApiResponse = await response.json();

  return data;
}

export async function loginUser(
  payload: LoginPayload
): Promise<ApiResponse> {
  return request(API_LOGIN, payload);
}

export async function registerUser(
  payload: RegisterPayload
): Promise<ApiResponse> {
  return request(API_REGISTER, payload);
}

export async function logoutUser(): Promise<ApiResponse> {
  const token = localStorage.getItem("auth_token");

  const response = await fetch(API_LOGOUT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data: ApiResponse = await response.json();

  return data;
}