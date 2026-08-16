import { CircleAlert, FolderKanban, SquareCheckBig, Users } from "lucide-react";
import DashProjectCard from "../../../Components/DashProjectCard";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import DashTaskCard from "../../../Components/DashTaskCard";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllTasks } from "../../../api/tasks.api";
import Loader from "../../../Components/Loader";
import type { DashbaordType } from "../../../types/types";
import { getAllProjects } from "../../../api/projects.api";
import { getDashbaord } from "../../../api/dashbaord.api";
import type { ProjectType } from "../../../types/project.types";
import type { TaskType } from "../../../types/tasks.type";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [dashbboard, setDashboard] = useState<DashbaordType>();
  const [loading, setLoading] = useState(false);

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

    const fetchProjects = async () => {
      try {
        setLoading(true);

        const data: any = await getAllProjects();

        setProjects(data || []);
        console.log(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const data: DashbaordType = await getDashbaord();

        setDashboard(data || []);
        console.log(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
    fetchDashboard();
    fetchProjects();
  }, []);

  const projectStatusItems = [
    {
      name: "New",
      value: dashbboard?.projectStatuses.new ?? 0,
      color: "#94A3B8",
    },
    {
      name: "In Progress",
      value: dashbboard?.projectStatuses.inProgress ?? 0,
      color: "#3B82F6",
    },
    {
      name: "Completed",
      value: dashbboard?.projectStatuses.completed ?? 0,
      color: "#10B981",
    },
    {
      name: "Delayed",
      value: dashbboard?.projectStatuses.delayed ?? 0,
      color: "#EF4444",
    },
  ];
  const statusGroups = projectStatusItems.filter((status) => status.value > 0);
  if (loading) {
    return <Loader />;
  }
  return (
    <section className="dashboard-page">
      <div className="dashboard-stats">
        <div className="stat-card">
          <div style={{ background: "#EFF6FF" }} className="card-img">
            <FolderKanban color="#155DFC" />
          </div>
          <h2>{dashbboard?.projects.total}</h2>
          <p className="gray-p">Total Projects</p>
          <p style={{ color: "#155DFC" }}>{dashbboard?.projects.active}</p>
        </div>
        <div className="stat-card">
          <div style={{ background: "#ECFDF5" }} className="card-img">
            <SquareCheckBig color="#009966" />
          </div>
          <h2>{dashbboard?.tasks.total}</h2>
          <p className="gray-p">Tasks</p>
          <p style={{ color: "#009966" }}>
            {dashbboard?.tasks.completed} completed
          </p>
        </div>
        <div className="stat-card">
          <div style={{ background: "#EEF2FF" }} className="card-img">
            <Users color="#4F39F6" />
          </div>
          <h2>{dashbboard?.workers.total}</h2>
          <p className="gray-p">Workers</p>
          <p style={{ color: "#4F39F6" }}>Team members</p>
        </div>
        <div className="stat-card">
          <div style={{ background: "#FFF1F2" }} className="card-img">
            <CircleAlert color="#EC003F" />
          </div>
          <h2>{dashbboard?.unpaidOrders.total}</h2>
          <p className="gray-p">Unpaid</p>
          <p style={{ color: "#EC003F" }}>
            ${dashbboard?.unpaidOrders.outstandingAmount.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="dashboard-middle">
        <div className="recent-projects">
          <div className="recent-head">
            <h2>Recent Projects</h2>
            <NavLink to="/main/projects">View all</NavLink>
          </div>
          <div className="recent-list">
            {projects.map((p: ProjectType) => (
              <DashProjectCard key={p.id} p={p} />
            ))}
          </div>
        </div>
        <div className="dashboard-pieChart">
          <div className="chart-name">
            <h2>Project Status</h2>
            <p className="gray-p">Distribution</p>
          </div>

          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusGroups}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                >
                  {statusGroups.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-data">
            {projectStatusItems.map((status) => (
              <div className="chart-item" key={status.name}>
                <div>
                  <span style={{ background: status.color }}></span>
                  <p>{status.name}</p>
                </div>
                <p>{status.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="active-tasks">
        <div className="active-tasks-head">
          <h2>Active Tasks</h2>
          <NavLink to="/main/tasks">View all</NavLink>
        </div>
        <div className="tasks-list">
          {tasks.map((t: TaskType) => (
            <DashTaskCard t={t} key={t.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
