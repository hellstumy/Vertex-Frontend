import type { createCommentType } from "../types/comment.type";

interface BackendError {
  message?: string;
}
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/comments`;

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

export async function createComment(
  data: createCommentType,
): Promise<createCommentType> {
  return request("/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
export async function deleteComment(id: string) {
  return request(`/${id}`, {
    method: "DELETE",
  });
}
