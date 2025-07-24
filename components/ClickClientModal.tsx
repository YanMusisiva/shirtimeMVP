"use client";

import { useState } from "react";
import { clientSchema } from "../lib/clientSchema";

interface ClickClientModalProps {
  nameProduct: string;
  onClose: () => void;
}

export default function ClickClientModal({
  nameProduct,
  onClose,
}: ClickClientModalProps) {
  const [email, setEmail] = useState("");
  const [numero, setNumero] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const validation = clientSchema.safeParse({ email, nameProduct, numero });
    if (!validation.success) {
      setMessage(validation.error.errors[0].message);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/clickclient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      // setMessage(data.message);
      setEmail("");
      setNumero("");
      setSent(true);
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
            Thank you for your choice! We will contact you in less than 10
            minutes
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center tracking-tight">
              Receive more information about{" "}
              <span className="font-bold text-black">
                &quot;{nameProduct}&quot;
              </span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="email"
                placeholder="Enter your e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 outline-none bg-white/70 text-gray-900 placeholder-gray-400 transition"
              />
              <input
                type="text"
                placeholder="Enter your Number (+256...)"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 outline-none bg-white/70 text-gray-900 placeholder-gray-400 transition"
              />
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
  title: "Modal - Click Client",
  description: "Modal for capturing click clients with email and number.",
};
