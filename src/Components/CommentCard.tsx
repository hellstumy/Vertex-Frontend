import { TrashIcon } from "lucide-react";
import type { CommentType } from "../types/comment.type";
import { useState } from "react";
import { deleteComment } from "../api/comment.api";

interface Props {
  c: CommentType;
}
export default function CommentCard({ c }: Props) {
  // Detete comment
  const [isDeleted, setIsDeleted] = useState(false);

  const handleCommentDelete = async () => {
    try {
      deleteComment(c.id);
      setIsDeleted(true);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div
      style={isDeleted ? { display: "none" } : { display: "flex" }}
      key={c.id}
      className="comment"
    >
      <div>
        <h3>{c.title} </h3>
        <p>{c.description}</p>
      </div>
      <button id={`comment-${c.id}-delete`} onClick={handleCommentDelete} className="secondary-btn">
        <TrashIcon />
      </button>
    </div>
  );
}
