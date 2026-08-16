export interface TaskType {
  id: string;
  project_id: string;
  worker_id: string;
  title: string;
  description: string;
  started_at: string;
  update_at: string;
  isReady: boolean;
  worker_comment: string;
  finished_at: string;
  deadline: string;
  project: {
    name: string;
  };
  worker: {
    fullname: string;
  };
}
export interface createTaskType {
  title: string;
  description: string;
  project_id: string;
  worker_id: string;
  deadline?: string | null;
}
export interface updateTaskType {
  worker_id?: string;
  title?: string;
  description?: string;
  isReady?: boolean;
  worker_comment?: string;
  deadline?: string;
}
export interface finishTaskType {
  finished_at: string;
  isReady: boolean;
}
