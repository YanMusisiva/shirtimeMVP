"use client";
import React, { useState } from "react";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Connexion classique Email / Mot de passe
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/products");
    } catch (err: any) {
      setError("❌ Accès refusé. Identifiants incorrects.");
    } finally {
      setLoading(false);
    }
  };

  // Connexion en un clic avec Google
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/admin/products");
    } catch (err: any) {
      setError("❌ Connexion Google annulée ou échouée.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0b0c] text-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm bg-[#111112] border border-neutral-800 p-8 rounded-sm shadow-2xl text-center">
        {/* Logo tournant SHIRTIME */}
        <div className="relative w-14 h-14 bg-white rounded-full p-1 mx-auto mb-4 animate-[spin_8s_linear_infinite]">
          <Image
            src="/file_0000000037946230a5bbd34766d5b786.png"
            alt="Logo"
            fill
            className="object-contain"
          />
        </div>

        <h1 className="text-xl font-black tracking-wider uppercase text-orange-500 italic mb-6">
          SHIRTIME HUB
        </h1>

        {error && (
          <p className="text-xs font-mono text-red-400 bg-red-950/30 border border-red-900 p-3 mb-4">
            {error}
          </p>
        )}

        {/* Bouton Google rapide */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          type="button"
          className="w-full bg-neutral-900 border border-neutral-800 hover:border-orange-500 text-white font-bold text-xs uppercase tracking-widest py-3 px-4 flex items-center justify-center gap-2 transition mb-6"
        >
          <span className="text-base">🌐</span> Connecter avec Google
        </button>

        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-neutral-800"></div>
          <span className="flex-shrink mx-4 text-neutral-500 text-[10px] uppercase tracking-widest">
            ou par email
          </span>
          <div className="flex-grow border-t border-neutral-800"></div>
        </div>

        <form
          onSubmit={handleEmailLogin}
          className="space-y-4 text-left text-xs"
        >
          <div>
            <label className="block text-neutral-400 uppercase tracking-widest font-bold mb-1.5">
              Email Admin
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-neutral-800 p-3 outline-none focus:border-orange-500 text-white"
            />
          </div>

          <div>
            <label className="block text-neutral-400 uppercase tracking-widest font-bold mb-1.5">
              Mot de passe
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-neutral-800 p-3 outline-none focus:border-orange-500 text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-black uppercase tracking-widest py-3.5 skew-x-[-8deg] hover:bg-orange-500 transition disabled:bg-neutral-800 disabled:text-neutral-600 mt-2"
          >
            {loading ? "VÉRIFICATION..." : "ENTRER AVEC EMAIL"}
          </button>
        </form>
      </div>
    </main>
  );
}
