"use client";

import { useState } from "react";

interface ClickCommentModalProps {
  onClose: () => void;
}

export default function ClickCommentModal({ onClose }: ClickCommentModalProps) {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/clickcomment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, comment }),
      });
      const data = await res.json();
      setSent(true);
      setName("");
      setComment("");

      if (res.ok) {
        setMessage("Comment submitted successfully!");
      } else {
        setMessage(data.message || "An error occurred.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de l'envoi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl w-full max-w-sm p-8 border border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-light"
          aria-label="Fermer"
        >
          ×
        </button>

        {sent ? (
          <div className="text-2xl font-semibold text-gray-900 mb-6 text-center tracking-tight">
            Thank you for your FeedBack!
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center tracking-tight">
              Please share your comments (FeedBack) - Thank you
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                placeholder="Enter your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                minLength={4}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 outline-none bg-white/70 text-gray-900 placeholder-gray-400 transition"
              />
              <textarea
                placeholder="Enter your Comments..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                minLength={10}
                maxLength={180}
                required
                className="w-full resize-none px-4 py-3 rounded-xl border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 outline-none bg-white/70 text-gray-900 placeholder-gray-400 transition"
              ></textarea>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-black hover:bg-gray-900 transition text-white font-semibold text-lg shadow-md disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </form>
          </>
        )}
        {message && (
          <p className="mt-5 text-center text-sm text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
}

export const metadata = {
  title: "Modal - Click Comment",
  description: "Modal for capturing comments.",
};
