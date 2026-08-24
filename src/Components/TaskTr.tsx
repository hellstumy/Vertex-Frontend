import { Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { useState } from "react";
import type { TaskType, updateTaskType } from "../types/tasks.type";
import { formatDate } from "../tools/FormateDate";
import { deleteTask, finishTask, updateTask } from "../api/tasks.api";
import type { WorkerType } from "../types/worker.types";
import { getAllWorkers } from "../api/workers.api";
import { useAuthStore } from "../store/auth.store";
import {
  errorNotification,
  succesfullNotification,
} from "../Notifications/notification";

interface Props {
  t: TaskType;
}

export default function TaskTr({ t }: Props) {
  const user = useAuthStore((state) => state.user);
  const isAdmin =
    user?.role === "admin" || user?.role === "owner" ? true : false;
  const [isDeleted, setIsDeleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  // Update task
  function formatDateTimeLocal(date: string) {
    if (!date) return "";

    const d = new Date(date);

    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - offset * 60 * 1000);

    return localDate.toISOString().slice(0, 16);
  }

  const [workers, setWorkers] = useState<WorkerType[]>([]);
  const [selectedWorker, setSelectedWorker] = useState(t.worker_id || "");
  const [title, setTitle] = useState(t.title || "");
  const [description, setDescription] = useState(t.description || "");
  const [workerComment, setWorkerComment] = useState(t.worker_comment || "");
  const [isReady, setIsReady] = useState(t.isReady);
  const [deadline, setDeadline] = useState(
    t.deadline ? formatDateTimeLocal(t.deadline) : "",
  );
  const handleUpdateTask = async (e: any) => {
    e.preventDefault();
    const updateData: updateTaskType = {
      worker_id: selectedWorker,
      title: title,
      description: description,
      worker_comment: workerComment,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
      isReady: isReady,
    };
    try {
      await updateTask(t.id, updateData);
      succesfullNotification("Task was updated");
    } catch (err) {
      if (err instanceof Error) {
        console.log("MESSAGE:", err.message);
        errorNotification(err.message);
      }
      console.log(err);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handlefinishTask = async (e: any) => {
    e.preventDefault();
    try {
      await finishTask(t.id);
      succesfullNotification("Task finished");
    } catch (err) {
      if (err instanceof Error) {
        console.log("MESSAGE:", err.message);
        errorNotification(err.message);
      }
    } finally {
      setIsModalOpen(false);
      window.location.reload();
    }
  };

  const openModal = async () => {
    const fetchWorkers = async () => {
      try {
        const data = await getAllWorkers();
        setWorkers(data as WorkerType[]);
      } catch (err) {
        console.log(err);
      }
    };

    await fetchWorkers();
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteTask(t.id);
      setIsDeleted(true);
      succesfullNotification("Task deleted");
    } catch (err) {
      if (err instanceof Error) {
        console.log("MESSAGE:", err.message);
        errorNotification(err.message);
      }
    }
  };
  return (
    <tr style={isDeleted ? { display: "none" } : { display: "table-row" }}>
      <td>{title}</td>
      <td>{t.project.name}</td>
      <td>
        {workers.find((w) => w.id === selectedWorker)?.fullname ??
          t.worker.fullname}
      </td>
      <td>
        <div className={isReady ? "paid" : "unpaid"}>
          {isReady ? "Ready" : "Not Ready"}
        </div>
      </td>
      <td>{t.finished_at ? formatDate(t.finished_at) : "Not finished"}</td>
      <td>{deadline ? formatDate(deadline) : "Without deadline"}</td>
      <td className="actions">
        <button id={`task-${t.id}-view`} onClick={() => navigate(`/main/tasks/${t.id}`)}>
          <Eye color="#45556C" size={18} />
        </button>
        <button
          id={`task-${t.id}-edit`}
          style={!isAdmin ? { display: "none" } : { display: "block" }}
          onClick={openModal}
        >
          <Pencil color="#45556C" size={18} />
        </button>
        <button
          id={`task-${t.id}-delete`}
          style={!isAdmin ? { display: "none" } : { display: "block" }}
          onClick={handleDelete}
        >
          <Trash2 color="#45556C" size={18} />
        </button>
      </td>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Edit task</h2>
        <form onSubmit={handleUpdateTask} action="">
          <select
            value={selectedWorker}
            onChange={(e) => setSelectedWorker(e.target.value)}
            name="worker"
            id={`task-${t.id}-worker`}
          >
            <option value="">Worker name</option>
            {workers.map((w) => (
              <option key={w.id} value={w.id}>
                {w.fullname}
              </option>
            ))}
          </select>
          <p>{selectedWorker}</p>
          <label htmlFor={`task-${t.id}-title`}>
            <p>Title</p>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              id={`task-${t.id}-title`}
              placeholder="Title"
            />
          </label>
          <div>
            <label htmlFor={`task-${t.id}-description`}>
              <p>Description</p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: "330px", height: "180px" }}
                name="desctiption"
                id={`task-${t.id}-description`}
                placeholder="lorem ipsum"
              ></textarea>
            </label>
            <label htmlFor={`task-${t.id}-worker-comment`}>
              <p>Worker comment</p>
              <textarea
                value={workerComment}
                onChange={(e) => setWorkerComment(e.target.value)}
                style={{ width: "330px", height: "180px" }}
                name="comment"
                id={`task-${t.id}-worker-comment`}
                placeholder="lorem ipsum"
              ></textarea>
            </label>
          </div>
          <div>
            <button
              id={`task-${t.id}-ready`}
              type="button"
              onClick={() => setIsReady(!isReady)}
              className={isReady ? "green-btn" : "red-btn"}
            >
              Is ready?
            </button>
          </div>

          <label htmlFor={`task-${t.id}-deadline`}>
            <p>Deadline</p>
            <input
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              type="datetime-local"
              id={`task-${t.id}-deadline`}
            />
          </label>
          <button id={`task-${t.id}-finish`} onClick={handlefinishTask} className="secondary-btn">
            Finish task
          </button>
          <button id={`task-${t.id}-save`} type="submit" className="primary-btn">
            Save
          </button>
        </form>
      </Modal>
    </tr>
  );
}
