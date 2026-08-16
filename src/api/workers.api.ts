import type {
  changePasswordType,
  SubmitTaskType,
  updateWorkerType,
  WorkerType,
} from "../types/worker.types";

interface BackendError {
  message?: string;
}
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/workers`;

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
export async function getAllWorkers() {
  return request("/", {
    method: "GET",
  });
}
export async function GetOneWorker(id: string): Promise<WorkerType> {
  return request<WorkerType>(`/${id}`, {
    method: "GET",
  });
}
export async function updateWorker(
  id: string,
  data: updateWorkerType,
): Promise<updateWorkerType> {
  return request<updateWorkerType>(`/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
export async function changePassword(
  data: changePasswordType,
): Promise<changePasswordType> {
  return request<changePasswordType>("/change-password", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
export async function submitTask(
  id: string,
  data: SubmitTaskType,
): Promise<SubmitTaskType> {
  return request<SubmitTaskType>(`/submit-task/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
export async function deleteWorker(id: string) {
  return request(`/${id}`, {
    method: "DELETE",
  });
}
