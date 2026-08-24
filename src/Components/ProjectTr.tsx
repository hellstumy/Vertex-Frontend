import { Eye, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import type { ProjectType, updateProjectType } from "../types/project.types";
import { formatDate } from "../tools/FormateDate";
import { deleteProject, updateProject } from "../api/projects.api";
import { getAllWorkers } from "../api/workers.api";
import type { WorkerType } from "../types/worker.types";
import { useAuthStore } from "../store/auth.store";
import {
  errorNotification,
  succesfullNotification,
} from "../Notifications/notification";

type Props = {
  p: ProjectType;
};
export default function ProjectTr({ p }: Props) {
  const user = useAuthStore((state) => state.user);
  const isAdmin =
    user?.role === "admin" || user?.role === "owner" ? true : false;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  function formatDateTimeLocal(date: string) {
    if (!date) return "";

    const d = new Date(date);

    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - offset * 60 * 1000);

    return localDate.toISOString().slice(0, 16);
  }

  // Update project
  const [workers, setWorkers] = useState<WorkerType[]>([]);
  const [workerId, setWorkerId] = useState(p.workerId || "");
  const [clientName, setClientName] = useState(p.client_name || "");
  const [name, setName] = useState(p.name || "");
  const [clientContact, setClientContact] = useState(p.client_contact || "");
  const [mapUrl, setMapUrl] = useState(p.map_url || "");
  const [selectedStatus, setSelectedStatus] = useState(p.status ?? "new");
  const [price, setPrice] = useState(p.price || 0.0);
  const [isPaid, setIsPaid] = useState(p.isPaid || false);
  const [endDate, setEndDate] = useState(formatDateTimeLocal(p.end_date) || "");
  const [deadline, setDeadline] = useState(
    p.deadline ? formatDateTimeLocal(p.deadline) : "",
  );

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

  const handleUpdateProject = async (e: any) => {
    e.preventDefault();
    const updateData: updateProjectType = {
      workerId,
      client_name: clientName,
      name,
      client_contact: clientContact,
      map_url: mapUrl,
      status: selectedStatus,
      price: String(price),
      isPaid,
      end_date: endDate
        ? new Date(`${endDate}T00:00:00`).toISOString()
        : undefined,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
    };

    try {
      await updateProject(p.id, updateData);

      setIsModalOpen(false);
      succesfullNotification("Project was updated");
    } catch (err) {
      if (err instanceof Error) {
        console.log("MESSAGE:", err.message);
        errorNotification(err.message);
      }
    }
  };

  let navigate = useNavigate();

  const statusFormater = {
    new: {
      statusClass: "new",
      statusLabel: "New",
    },
    inprogress: {
      statusClass: "inprogress",
      statusLabel: "In Progress",
    },
    done: {
      statusClass: "completed",
      statusLabel: "Done",
    },
  };

  const currentStatus =
    statusFormater[
      (selectedStatus ?? p.status ?? "new") as keyof typeof statusFormater
    ] ?? statusFormater.new;

  const handleDelete = async () => {
    try {
      await deleteProject(p.id);
      setIsDeleted(true);
      succesfullNotification("Project deleted");
    } catch (err) {
      if (err instanceof Error) {
        console.log("MESSAGE:", err.message);
        errorNotification(err.message);
      }
    }
  };
  return (
    <tr style={isDeleted ? { display: "none" } : { display: "table-row" }}>
      <td>{name}</td>
      <td>{clientName}</td>
      <td>
        <div className={currentStatus.statusClass}>
          {currentStatus.statusLabel}
        </div>
      </td>
      <td>${price}</td>
      <td>
        <div className={isPaid ? "paid" : "unpaid"}>
          {isPaid ? "Paid" : "Unpaid"}
        </div>
      </td>
      <td>{formatDate(p.start_date)}</td>
      <td>{deadline ? formatDate(deadline) : "Without deadline"}</td>
      <td className="actions">
        <button id={`project-${p.id}-view`} onClick={() => navigate(`/main/projects/${p.id}`)}>
          <Eye color="#45556C" size={18} />
        </button>
        <button
          id={`project-${p.id}-edit`}
          style={!isAdmin ? { display: "none" } : { display: "block" }}
          onClick={openModal}
        >
          <Pencil color="#45556C" size={18} />
        </button>
        <button
          id={`project-${p.id}-delete`}
          style={!isAdmin ? { display: "none" } : { display: "block" }}
          onClick={handleDelete}
        >
          <Trash2 color="#45556C" size={18} />
        </button>
      </td>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Edit project</h2>
        <form onSubmit={handleUpdateProject} action="">
          <label htmlFor={`project-${p.id}-worker`}>
            <p>Worker</p>
            <select
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
              name="worker"
              id={`project-${p.id}-worker`}
            >
              <option value="">Select Worker</option>
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.fullname}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor={`project-${p.id}-name`}>
            <p>Project name</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              id={`project-${p.id}-name`}
              placeholder="DVM Corp."
            />
          </label>
          <div>
            <label htmlFor={`project-${p.id}-client-name`}>
              <p>Client name</p>
              <input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                type="text"
                id={`project-${p.id}-client-name`}
                placeholder="DVM Corp."
              />
            </label>
            <label htmlFor={`project-${p.id}-client-contact`}>
              <p>Client contact</p>
              <input
                value={clientContact}
                onChange={(e) => setClientContact(e.target.value)}
                type="text"
                id={`project-${p.id}-client-contact`}
                placeholder="test@mail.com"
              />
            </label>
          </div>
          <label htmlFor={`project-${p.id}-price`}>
            <p>Price</p>
            <input
              type="text"
              id={`project-${p.id}-price`}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="$1000.50"
            />
          </label>
          <label htmlFor={`project-${p.id}-map-url`}>
            <p>MapUrl</p>
            <input
              value={mapUrl}
              onChange={(e) => setMapUrl(e.target.value)}
              type="text"
              id={`project-${p.id}-map-url`}
              placeholder="https://maps.app.goo.gl/..."
            />
          </label>
          <div>
            <label htmlFor="status">
              <p>Status</p>
              <button
                id={`project-${p.id}-status-new`}
                onClick={() => setSelectedStatus("new")}
                type="button"
                className={
                  selectedStatus === "new" ? "primary-btn" : "secondary-btn"
                }
              >
                New
              </button>
              <button
                id={`project-${p.id}-status-in-progress`}
                onClick={() => setSelectedStatus("inprogress")}
                type="button"
                className={
                  selectedStatus === "inprogress"
                    ? "primary-btn"
                    : "secondary-btn"
                }
              >
                In Progress
              </button>
              <button
                id={`project-${p.id}-status-done`}
                onClick={() => setSelectedStatus("done")}
                type="button"
                className={
                  selectedStatus === "done" ? "primary-btn" : "secondary-btn"
                }
              >
                Done
              </button>
            </label>
            <label htmlFor="isPaid">
              <p>Is Paid?</p>
              <div>
                <button
                  id={`project-${p.id}-paid-yes`}
                  onClick={() => setIsPaid(true)}
                  type="button"
                  className={isPaid === true ? "green-btn" : "secondary-btn"}
                >
                  Yes
                </button>
                <button
                  id={`project-${p.id}-paid-no`}
                  onClick={() => setIsPaid(false)}
                  type="button"
                  className={isPaid === false ? "red-btn" : "secondary-btn"}
                >
                  No
                </button>
              </div>
            </label>
          </div>
          <label htmlFor={`project-${p.id}-end-date`}>
            <p>Finish Date</p>
            <input
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              type="date"
              id={`project-${p.id}-end-date`}
            />
          </label>
          <label htmlFor={`project-${p.id}-deadline`}>
            <p>Deadline</p>
            <input
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              type="datetime-local"
              id={`project-${p.id}-deadline`}
            />
          </label>
          <button id={`project-${p.id}-save`} type="submit" className="primary-btn">
            Save
          </button>
        </form>
      </Modal>
    </tr>
  );
}
