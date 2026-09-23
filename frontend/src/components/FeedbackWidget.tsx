import { useEffect, useRef, useState, type FormEvent } from "react";
import { apiPost } from "../lib/api";

const MAX_TOPIC_LENGTH = 100;
const MAX_CONTENT_LENGTH = 5_000;

interface FeedbackApiResponse {
  status: "success";
  message: string;
  data: {
    feedback_id: string;
  };
}

interface FeedbackErrorResponse {
  status?: "error";
  message?: string;
}

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="feedback-trigger"
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
      >
        <span aria-hidden="true">✎</span>
        Feedback
      </button>
      {isOpen && <FeedbackModal onClose={() => setIsOpen(false)} />}
    </>
  );
}

function FeedbackModal({ onClose }: { onClose: () => void }) {
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const topicInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    topicInput.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const submitFeedback = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const result = await apiPost<FeedbackApiResponse | FeedbackErrorResponse>(
        "/api/feedback",
        { topic, content },
      );

      if (result.status !== "success") {
        throw new Error(result.message ?? "Không thể gửi góp ý lúc này.");
      }

      setSuccessMessage(result.message);
      setTopic("");
      setContent("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Không thể gửi góp ý lúc này.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="feedback-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="feedback-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="feedback-modal-head">
          <div>
            <p>Chia sẻ cùng Mộc Tâm</p>
            <h2 id="feedback-title">Feedback</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Đóng biểu mẫu feedback">
            ×
          </button>
        </div>

        {successMessage ? (
          <div className="feedback-success" role="status">
            <span aria-hidden="true">✓</span>
            <h3>{successMessage}</h3>
            <p>Ý kiến của bạn giúp Mộc Tâm phục vụ tốt hơn mỗi ngày.</p>
            <button type="button" onClick={onClose}>Đóng</button>
          </div>
        ) : (
          <form onSubmit={submitFeedback}>
            <label htmlFor="feedback-topic">Chủ đề</label>
            <p className="field-note">Một chủ đề ngắn giúp chúng tôi phân loại góp ý.</p>
            <input
              ref={topicInput}
              id="feedback-topic"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              maxLength={MAX_TOPIC_LENGTH}
              placeholder="Ví dụ: Trải nghiệm mua hàng"
              required
            />

            <div className="feedback-content-label">
              <label htmlFor="feedback-content">Nội dung</label>
              <span aria-live="polite">{content.length} / {MAX_CONTENT_LENGTH}</span>
            </div>
            <textarea
              id="feedback-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              maxLength={MAX_CONTENT_LENGTH}
              rows={7}
              placeholder="Hãy chia sẻ điều bạn yêu thích hoặc mong muốn Mộc Tâm cải thiện..."
              required
            />

            {errorMessage && <p className="feedback-error" role="alert">{errorMessage}</p>}

            <div className="feedback-actions">
              <button type="button" onClick={onClose}>Hủy</button>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang gửi..." : "Gửi feedback"}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
