export interface WorkerType {
  id: string;
  login: string;
  fullname: string;
  email: string;
  phone: string;
  role: string;
  percentage: number;
  total: number;
  telegram_id: string;
  created_at: string;
  updated_at: string;
}
export interface createWorkerType {
  login: string;
  fullname: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}
export interface changePasswordType {
  oldPassword: string;
  newPassword: string;
}
export interface SubmitTaskType {
  isReady: boolean;
  worker_comment: string;
}
export interface updateWorkerType {
  login?: string;
  fullname?: string;
  phone?: string;
  email?: string;
  role?: string;
  percentage?: number;
  total?: number;
}
