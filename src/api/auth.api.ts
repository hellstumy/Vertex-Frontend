import type { createWorkerType } from "../types/worker.types";

interface BackendError {
  message?: string;
}
interface LoginResponse {
  token: string;
}
interface LoginData {
  login?: string;
  password?: string;
}

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/auth`;

async function request<T = unknown>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("token");

  const customHeaders = (options.headers as Record<string, string>) || {};

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...customHeaders,
    },
  });

  const text = await response.text();
  let data: unknown;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text };
  }

  if (!response.ok) {
    const errorMessage = (data as BackendError)?.message || "Server error";
    throw new Error(errorMessage);
  }

  return data as T;
}

export async function LoginUser(LoginData: LoginData): Promise<LoginResponse> {
  const data = await request<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify({
      login: LoginData.login,
      password: LoginData.password,
    }),
  });

  if (data?.token) {
    localStorage.setItem("token", data.token);
  }

  return data;
}

export async function getMe() {
  return request("/me", {
    method: "GET",
  });
}
export async function createWorker(
  data: createWorkerType,
): Promise<createWorkerType> {
  return request("/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
