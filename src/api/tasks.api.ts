import type {
  createTaskType,
  finishTaskType,
  TaskType,
  updateTaskType,
} from "../types/tasks.type";

interface BackendError {
  message?: string;
}
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/tasks`;

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
export async function getAllTasks() {
  return request("/", {
    method: "GET",
  });
}
export async function getOneTask(id: string): Promise<TaskType> {
  return request<TaskType>(`/${id}`, {
    method: "GET",
  });
}
export async function craeteTask(
  data: createTaskType,
): Promise<createTaskType> {
  return request("/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
export async function updateTask(
  id: string,
  data: updateTaskType,
): Promise<updateTaskType> {
  return request(`/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function finishTask(id: string): Promise<finishTaskType> {
  const now = new Date().toISOString();
  const data: finishTaskType = {
    finished_at: now,
    isReady: true,
  };
  return request(`/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteTask(id: string) {
  return request(`/${id}`, {
    method: "DELETE",
  });
}
