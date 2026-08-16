import { Mail, Phone, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { WorkerType } from "../types/worker.types";
import { useState } from "react";
import { deleteWorker } from "../api/workers.api";
import {
  errorNotification,
  succesfullNotification,
} from "../Notifications/notification";

interface Props {
  w: WorkerType;
}
export default function TeamCard({ w }: Props) {
  const [isDeleted, setIsDeleted] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await deleteWorker(w.id);
      setIsDeleted(true);
      succesfullNotification("Worker deleted");
    } catch (err) {
      if (err instanceof Error) {
        console.log("MESSAGE:", err.message);
        errorNotification(err.message);
      }
    }
  };
  return (
    <div
      style={isDeleted ? { display: "none" } : { display: "flex" }}
      className="team-card"
    >
      <div className="teamCard-head">
        <div className="worker-name">
          <h3>{w.fullname}</h3>
          <div className={`role ${w.role === "worker" ? "worker" : "admin"}`}>
            {w.role}
          </div>
        </div>
        <button onClick={handleDelete}>
          <Trash2 size={18} />
        </button>
      </div>
      <div className="worker-info">
        <a href={`mailto:${w.email}`} className="gray-p">
          <Mail /> {w.email ? w.email : "None"}
        </a>
        <a href={`tel:${w.phone}`} className="gray-p">
          <Phone /> {w.phone ? w.phone : "None"}
        </a>
        <p className="bold-p">Salary: ${w.total ? w.total : "None"}</p>
      </div>
      <button
        onClick={() => navigate(`/main/team/${w.id}`)}
        className="primary-btn"
      >
        Profile
      </button>
    </div>
  );
}
