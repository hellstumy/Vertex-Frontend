import "./Info.css";
import { Calendar, DollarSign, Mail, Undo2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import DashTaskCard from "../../Components/DashTaskCard";
import { useEffect, useState } from "react";
import { getOneProject } from "../../api/projects.api";
import { type TaskType } from "../../types/tasks.type";
import Loader from "../../Components/Loader";
import { formatDate } from "../../tools/FormateDate";
import type { CommentType, createCommentType } from "../../types/comment.type";
import { createComment } from "../../api/comment.api";
import CommentCard from "../../Components/CommentCard";
import type { ProjectType } from "../../types/project.types";
import { useAuthStore } from "../../store/auth.store";

export default function ProjectInfoPage() {
  const user = useAuthStore((state) => state.user);
  const isAdmin =
    user?.role === "admin" || user?.role === "owner" ? true : false;
  const { projectId } = useParams();
  const [project, setProject] = useState<ProjectType | null>(null);
  const [tasks, setTasks] = useState<TaskType[] | null>(null);
  const [comment, setComments] = useState<CommentType[] | null>(null);
  const [loading, setLoading] = useState(false);

  // Create comment
  const [commentTitle, setCommentTitle] = useState("");
  const [commentDescription, setCommentDescription] = useState("");

  const [selectedStatus] = useState(project?.status ?? "new");
  let navigate = useNavigate();

  const handleCreateComment = async (e: any) => {
    e.preventDefault();
    const newComment: createCommentType = {
      title: commentTitle,
      description: commentDescription,
      project_id: projectId || "",
    };
    try {
      await createComment(newComment);
      const updatedProject = await getOneProject(projectId || "");
      setComments(updatedProject.comments ?? null);
    } catch (err) {
      console.log(err);
      alert("Some error");
    } finally {
      setCommentTitle("");
      setCommentDescription("");
    }
  };

  useEffect(() => {
    const fetchproject = async () => {
      try {
        setLoading(true);
        const data: ProjectType = await getOneProject(projectId || "");
        setProject(data);
        setTasks(data.tasks ?? null);
        setComments(data.comments ?? null);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchproject();
  }, [projectId]);
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
      (project?.status ??
        selectedStatus ??
        "new") as keyof typeof statusFormater
    ] ?? statusFormater.new;
  if (loading) {
    return <Loader />;
  }
  return (
    <section className="project-info">
      <div className="project-info-head">
        <button
          onClick={() => navigate(-1)}
          className="secondary-btn"
          aria-label="Go back"
        >
          <Undo2 />
        </button>
        <div className="project-info_name">
          <div>
            <h2>{project?.name}</h2>
            <div className={currentStatus.statusClass}>
              {currentStatus.statusLabel}
            </div>
            <div className={project?.isPaid ? "paid" : "unpaid"}>
              {project?.isPaid ? "Paid" : "Unpaid"}
            </div>
          </div>
        </div>
      </div>
      <div className="project-info_main">
        <div className="project-info_left">
          <div className="project-info_wrap">
            <div className="info-wrap_head">
              <h2>Client Information</h2>
            </div>
            <div className="info-main wrapCard">
              <h3>
                <p className="gray-p">Client</p> {project?.client_name}
              </h3>
              <h3>
                <p className="gray-p">Responsible</p>{" "}
                {project?.worker.fullname
                  ? project?.worker.fullname
                  : "Not worker"}
              </h3>
              <a href={`mailto:${project?.client_contact}`}>
                <Mail />
                {project?.client_contact}
              </a>
              <p>
                <Calendar /> Deadline:{" "}
                {project?.deadline
                  ? formatDate(project.deadline)
                  : "Withot deadline"}
              </p>
              <p>
                <DollarSign /> Budget: ${project?.price}
              </p>
            </div>
          </div>
          <div className="project-info_wrap">
            <div className="info-wrap_head">
              <h2>Tasks ({tasks?.length})</h2>
            </div>
            <div className="info-main">
              {tasks?.map((t: TaskType) => (
                <DashTaskCard key={t.id} t={t} />
              ))}
            </div>
          </div>
          <div className="project-info_wrap">
            <div className="info-wrap_head">
              <h2>Comments</h2>
            </div>
            <div className="info-main">
              {comment?.map((c) => (
                <CommentCard key={c.id} c={c} />
              ))}
              <form
                style={!isAdmin ? { display: "none" } : { display: "flex" }}
                onSubmit={handleCreateComment}
                action=""
              >
                <input
                  value={commentTitle}
                  onChange={(e) => setCommentTitle(e.target.value)}
                  placeholder="Title"
                  id="commentTitle"
                  style={{ width: "33%" }}
                  type="text"
                />
                <input
                  value={commentDescription}
                  onChange={(e) => setCommentDescription(e.target.value)}
                  id="commentInput"
                  type="text"
                  placeholder="Add a comment..."
                />
                <button type="submit" className="primary-btn">
                  Post
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
