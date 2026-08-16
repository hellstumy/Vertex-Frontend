import { useEffect, useState } from "react";
import TaskTr from "../../../Components/TaskTr";
import Modal from "../../../Components/Modal";
import { craeteTask, getAllTasks } from "../../../api/tasks.api";
import type { createTaskType, TaskType } from "../../../types/tasks.type";
import Loader from "../../../Components/Loader";
import { getAllProjects } from "../../../api/projects.api";
import { getAllWorkers } from "../../../api/workers.api";
import type { WorkerType } from "../../../types/worker.types";
import type { ProjectType } from "../../../types/project.types";
import {
  alertNotificaction,
  errorNotification,
  succesfullNotification,
} from "../../../Notifications/notification";
import { useAuthStore } from "../../../store/auth.store";

export default function Tasks() {
  const user = useAuthStore((state) => state.user);
  const isAdmin =
    user?.role === "admin" || user?.role === "owner" ? true : false;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const filters = ["All", "Ready", "Not Ready"];
  const [activeFilter, setActiveFilter] = useState("All");
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [workers, setWorkers] = useState<WorkerType[]>([]);

  const [taskTitle, setTaskTitle] = useState("");
  const [selectedWorker, setSelectedWorker] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      taskTitle.trim() === "" ||
      taskDescription.trim() === "" ||
      selectedProject === "" ||
      selectedWorker === ""
    ) {
      alertNotificaction("Fill in all required fields.");
      return;
    }

    const newTask: createTaskType = {
      title: taskTitle,
      description: taskDescription,
      project_id: selectedProject,
      worker_id: selectedWorker,
      deadline: deadline || null,
    };

    try {
      await craeteTask(newTask);

      const refreshTasks = (await getAllTasks()) as TaskType[];
      setTasks(refreshTasks || []);

      succesfullNotification("Task was created");
      setIsModalOpen(false);
    } catch (err) {
      if (err instanceof Error) {
        console.log("MESSAGE:", err.message);
        errorNotification(err.message);
      }
    } finally {
      setTaskTitle("");
      setTaskDescription("");
      setSelectedProject("");
      setSelectedWorker("");
      setDeadline("");
    }
  };

  async function openModal() {
    const fetchProjects = async () => {
      try {
        const data = await getAllProjects();
        setProjects(data as ProjectType[]);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchWorkers = async () => {
      try {
        const data = await getAllWorkers();
        setWorkers(data as WorkerType[]);
      } catch (err) {
        console.log(err);
      }
    };

    await fetchProjects();
    await fetchWorkers();
    setIsModalOpen(true);
  }
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        await getAllTasks().then((data: any) => {
          setTasks(data);
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const filtredTasks = tasks.filter((task: TaskType) => {
    if (!isAdmin && task.worker_id !== user?.id) {
      return false;
    }
    if (activeFilter === "All") {
      return true;
    }
    if (activeFilter === "Ready") {
      return task.isReady;
    }
    if (activeFilter === "Not Ready") {
      return !task.isReady;
    }
    return true;
  });

  if (loading) {
    return <Loader />;
  }
  return (
    <section className="tasks">
      <div className="dash-head">
        <div className="filter">
          <input
            id="finder"
            type="text"
            placeholder="Search by title or client..."
          />
          <ul>
            {filters.map((filter) => (
              <li key={filter}>
                <button
                  className={activeFilter === filter ? "active-filter" : ""}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button onClick={() => openModal()} className="primary-btn">
          New Task
        </button>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Project</th>
              <th>Assignee</th>
              <th>Status</th>
              <th>Finished</th>
              <th>Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtredTasks.map((t: TaskType) => (
              <TaskTr key={t.id} t={t} />
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Create Task</h2>
        <form onSubmit={handleCreateTask} action="">
          <select
            onChange={(e) => setSelectedWorker(e.target.value)}
            name="worker"
            id="worker"
          >
            <option value="">Select worker</option>
            {workers.map((w) => (
              <option key={w.id} value={w.id}>
                {w.fullname}
              </option>
            ))}
          </select>
          <p>{selectedWorker}</p>
          <select
            onChange={(e) => setSelectedProject(e.target.value)}
            name="project"
            id="project"
          >
            <option value="">Select project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name ? p.name : p.client_name}
              </option>
            ))}
          </select>
          <label htmlFor="taskTitle">
            <p>Task Title</p>
            <input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              id="tasktitle"
              type="text"
            />
          </label>
          <label htmlFor="taskDescription">
            <p>Task Description</p>
            <textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              style={{ width: "400px", height: "140px" }}
              name="taskDesc"
              id="taskDescription"
            ></textarea>
          </label>
          <label htmlFor="taskdeadline">
            <p>Dead line</p>
            <input
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              type="datetime-local"
            />
          </label>
          <button type="submit" className="primary-btn">
            Save
          </button>
        </form>
      </Modal>
    </section>
  );
}
