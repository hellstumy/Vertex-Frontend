import { NavLink } from "react-router-dom";
import type { TaskType } from "../types/tasks.type";
import { formatDate } from "../tools/FormateDate";
interface Props {
  t: TaskType;
}
export default function DashTaskCard({ t }: Props) {
  return (
    <div className="dash-tasks-item">
      <div className="dashTask-name">
        <h3>{t.title}</h3>
      </div>
      <div className="dashTask-info">
        <p className="gray-p">
          {t.deadline ? formatDate(t.deadline) : "NO deadline"}
        </p>
        <div className={t.isReady ? "paid" : "unpaid"}>
          {t.isReady ? "Ready" : "Not ready"}{" "}
        </div>
        <button className="green-btn">
          {<NavLink to={`/main/tasks/${t.id}`}>View</NavLink>}
        </button>
      </div>
    </div>
  );
}
