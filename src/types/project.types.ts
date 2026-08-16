import type { CommentType } from "./comment.type";
import type { TaskType } from "./tasks.type";

export interface ProjectType {
  id: string;
  workerId: string;
  client_name: string;
  name: string;
  client_contact: string;
  map_url: string;
  client_message: string;
  status: string;
  price: string;
  isPaid: boolean;
  start_date: string;
  end_date: string;
  deadline: string;
  worker: {
    id: string;
    fullname: string;
    login: string;
  };
  tasks: TaskType[];
  comments: CommentType[];
}
export interface createProjectType {
  name: string;
  client_name: string;
  client_contact: string;
  map_url: string;
  client_message: string;
}
export interface updateProjectType {
  workerId?: string;
  client_name?: string;
  name?: string;
  client_contact?: string;
  map_url?: string;
  client_message?: string;
  status?: string;
  isPaid?: boolean;
  price?: string;
  end_date?: string;
  deadline?: string;
}
