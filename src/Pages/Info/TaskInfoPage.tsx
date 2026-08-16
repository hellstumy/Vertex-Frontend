import "./Info.css";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FolderKanban,
  MessageSquareText,
  Undo2,
  UserRound,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { TaskType } from "../../types/tasks.type";
import { getOneTask } from "../../api/tasks.api";
import { formatDate, formatDateTime } from "../../tools/FormateDate";
import Loader from "../../Components/Loader";
import Modal from "../../Components/Modal";
import {
  errorNotification,
  succesfullNotification,
} from "../../Notifications/notification";
import { submitTask } from "../../api/workers.api";

export default function TaskInfoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { taskId } = useParams();
  const [task, setTask] = useState<TaskType | null>(null);
  const [loading, setLoading] = useState(false);
  const [workerComment, setWorkerComment] = useState("");
  const [newWorkerComment, setNewWorkerCommet] = useState("");
  const navigate = useNavigate();

  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await submitTask(taskId || "", {
        isReady: true,
        worker_comment: newWorkerComment,
      });

      setWorkerComment(newWorkerComment);

      succesfullNotification("Task submitted");
      setIsModalOpen(false);
      setNewWorkerCommet("");
    } catch (err) {
      if (err instanceof Error) {
        console.log("MESSAGE:", err.message);
        errorNotification(err.message);
      }
    }
  };

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const data: TaskType = await getOneTask(taskId || "");
        setTask(data);
        setWorkerComment(data.worker_comment);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);
  if (loading) {
    return <Loader />;
  }
  return (
    <section className="task-info">
      <div className="task-info__header">
        <button
          className="secondary-btn task-info__back"
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <Undo2 size={19} />
        </button>

        <div className="task-info__heading">
          <div className="task-info__title-row">
            <h1>{task?.title}</h1>
          </div>
          <p className="gray-p">Task ID: {task?.id}</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="primary-btn">
          Complete task
        </button>
      </div>

      <div className="task-info__layout">
        <div className="task-info__content">
          <article className="task-info__card">
            <div className="task-info__card-heading">
              <ClipboardList size={20} />
              <h2>Description</h2>
            </div>
            <p className="task-info__description">{task?.description}</p>
          </article>

          <article className="task-info__card">
            <div className="task-info__card-heading">
              <MessageSquareText size={20} />
              <h2>Worker comment</h2>
            </div>

            <div className="task-info__comment">
              <p>{workerComment ? workerComment : "Not comments"}</p>
              <span>
                Updated {task?.update_at ? formatDate(task.update_at) : ""}
              </span>
            </div>
          </article>
        </div>

        <div className="task-info__sidebar">
          <article className="task-info__card task-info__details-card">
            <h2>Task details</h2>
            <dl className="task-info__details">
              <div>
                <dt>
                  <FolderKanban size={18} /> Project
                </dt>
                <dd>
                  <a
                    onClick={() =>
                      navigate(`/main/projects/${task?.project_id}`)
                    }
                  >
                    {task?.project.name}
                  </a>
                </dd>
              </div>
              <div>
                <dt>
                  <UserRound size={18} /> Assignee
                </dt>
                <dd>
                  <a onClick={() => navigate(`/main/team/${task?.worker_id}`)}>
                    {task?.worker.fullname}
                  </a>
                </dd>
              </div>
              <div>
                <dt>
                  <CalendarDays size={18} /> Deadline
                </dt>
                <dd>
                  {task?.deadline ? formatDate(task.deadline) : "Not deadline"}
                </dd>
              </div>
              <div>
                <dt>
                  <Clock3 size={18} /> Started
                </dt>
                <dd>
                  {task?.started_at ? formatDateTime(task.started_at) : ""}
                </dd>
              </div>
              <div>
                <dt>
                  <Clock3 size={18} /> Last update
                </dt>
                <dd>{task?.update_at ? formatDateTime(task.update_at) : ""}</dd>
              </div>
              <div>
                <dt>
                  <CheckCircle2 size={18} /> Completion
                </dt>
                <dd>
                  <span
                    className={
                      task?.isReady
                        ? "task-info__ready"
                        : "task-info__not-ready"
                    }
                  >
                    {task?.isReady ? "Completed" : "In Progress"}
                  </span>
                </dd>
              </div>
            </dl>
          </article>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Complete Task</h2>
        <form onSubmit={handleSubmitTask} action="">
          <textarea
            value={newWorkerComment}
            onChange={(e) => setNewWorkerCommet(e.target.value)}
            style={{ width: "300px", height: "200px" }}
            placeholder="Add your comment"
            id="commentFromWorker"
          />
          <button type="submit" className="primary-btn">
            Submit
          </button>
        </form>
      </Modal>
    </section>
  );
}
