import { useState } from "react";
import type { ProjectType } from "../types/project.types";

interface Props {
  p: ProjectType;
}
export default function DashProjectCard({ p }: Props) {
  const [selectedStatus] = useState(p.status ?? "new");
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
      statusClass: "done",
      statusLabel: "Done",
    },
  };
  const currentStatus =
    statusFormater[
      (p.status ?? selectedStatus ?? "new") as keyof typeof statusFormater
    ] ?? statusFormater.new;
  return (
    <div className="dashProject-card">
      <div className="recent-name">
        <p>{p.name}</p>
        <p className="gray-p">{p.client_name}</p>
      </div>
      <div className="recent-info">
        <div className={currentStatus.statusClass}>
          {currentStatus.statusLabel}
        </div>
        <div className={p.isPaid ? "paid" : "unpaid"}>
          {p.isPaid ? "Paid" : "Unpaid"}
        </div>
        <p className="bold-p">${p.price}</p>
      </div>
    </div>
  );
}
