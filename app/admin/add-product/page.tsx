"use client";
import React, { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase"; // 👈 On importe l'instance Firestore directe 'db'
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, collection } from "firebase/firestore"; // 👈 On ajoute les fonctions Firestore
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const [form, setForm] = useState({
    id: "",
    nameEN: "",
    nameFR: "",
    descEN: "",
    descFR: "",
    detailEN: "",
    detailFR: "",
    price: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/admin/login");
      } else {
        setAuthLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const uploadToCloudinary = async (
    file: File,
    resourceType: "image" | "video",
  ): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "shirtime_preset");

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok)
      throw new Error(`Échec de l'envoi du média (${resourceType})`);
    const data = await response.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !videoFile) {
      setMessage(
        "❌ La photo principale ET la vidéo technique sont obligatoires !",
      );
      return;
    }

    setLoading(true);
    setMessage("🚀 Téléversement des médias vers Cloudinary...");

    try {
      // 1. Envoi vers Cloudinary
      const imgUrl = await uploadToCloudinary(imageFile, "image");
      const videoUrl = await uploadToCloudinary(videoFile, "video");

      setMessage("💾 Écriture directe et sécurisée dans Firebase Firestore...");

      // 2. ÉCRITURE EN DIRECT SANS PASSER PAR L'API ROUTE
      // Firebase injecte automatiquement vos accès Admin ici !
      const productRef = doc(collection(db, "products"), form.id);

      await setDoc(productRef, {
        id: form.id,
        nameEN: form.nameEN,
        nameFR: form.nameFR,
        descEN: form.descEN,
        descFR: form.descFR,
        detailEN: form.detailEN,
        detailFR: form.detailFR,
        price: parseFloat(form.price),
        img: imgUrl,
        video: videoUrl,
        createdAt: new Date().toISOString(),
      });

      setMessage("🎉 Produit propulsé avec succès sur SHIRTIME !");
      setForm({
        id: "",
        nameEN: "",
        nameFR: "",
        descEN: "",
        descFR: "",
        detailEN: "",
        detailFR: "",
        price: "",
      });
      setImageFile(null);
      setVideoFile(null);
    } catch (error: unknown) {
      console.error(error);
      setMessage(
        `❌ Échec : ${error instanceof Error ? error.message : "Erreur lors de l'enregistrement"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0b0b0c] text-center pt-24 font-mono text-xs text-neutral-500">
        VÉRIFICATION COMPTE ADMIN...
      </div>
    );
  }

  return (
    // ... Le reste de votre code JSX avec votre beau formulaire reste identique !
    <main className="min-h-screen bg-[#0b0b0c] text-white p-6 md:p-12 font-sans selection:bg-orange-500">
      <div className="max-w-3xl mx-auto bg-[#111112] border border-neutral-800 p-8 rounded-sm shadow-xl">
        <div className="flex justify-between items-center mb-8 border-b border-neutral-800 pb-4">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-wider text-orange-500 italic">
              SHIRTIME ADD HUB
            </h1>
            <p className="text-neutral-400 text-xs uppercase tracking-widest">
              Créer un nouvel équipement
            </p>
          </div>
          <a
            href="/admin/products"
            className="border border-neutral-700 text-neutral-400 font-bold text-xs uppercase tracking-widest px-4 py-2 hover:text-white transition"
          >
            ← Retour à l&apos;inventaire
          </a>
        </div>

        {message && (
          <div className="p-4 mb-6 bg-neutral-900 border border-neutral-800 text-xs font-mono text-orange-400">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-sm">
          <div>
            <label className="block text-neutral-400 text-xs uppercase font-bold mb-2">
              ID Unique (ex: shirtime-04)
            </label>
            <input
              required
              type="text"
              name="id"
              value={form.id}
              onChange={handleChange}
              className="w-full bg-black border border-neutral-800 p-3 focus:border-orange-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-400 text-xs uppercase font-bold mb-2">
                Nom (EN)
              </label>
              <input
                required
                type="text"
                name="nameEN"
                value={form.nameEN}
                onChange={handleChange}
                className="w-full bg-black border border-neutral-800 p-3 focus:border-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-neutral-400 text-xs uppercase font-bold mb-2">
                Nom (FR)
              </label>
              <input
                required
                type="text"
                name="nameFR"
                value={form.nameFR}
                onChange={handleChange}
                className="w-full bg-black border border-neutral-800 p-3 focus:border-orange-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-400 text-xs uppercase font-bold mb-2">
              Prix ($ USD)
            </label>
            <input
              required
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full bg-black border border-neutral-800 p-3 focus:border-orange-500 outline-none font-mono"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-400 text-xs uppercase font-bold mb-2">
                Description Courte (EN)
              </label>
              <textarea
                required
                rows={3}
                name="descEN"
                value={form.descEN}
                onChange={handleChange}
                className="w-full bg-black border border-neutral-800 p-3 focus:border-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-neutral-400 text-xs uppercase font-bold mb-2">
                Description Courte (FR)
              </label>
              <textarea
                required
                rows={3}
                name="descFR"
                value={form.descFR}
                onChange={handleChange}
                className="w-full bg-black border border-neutral-800 p-3 focus:border-orange-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-400 text-xs uppercase font-bold mb-2">
                Détails Techniques (EN)
              </label>
              <textarea
                required
                rows={3}
                name="detailEN"
                value={form.detailEN}
                onChange={handleChange}
                className="w-full bg-black border border-neutral-800 p-3 focus:border-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-neutral-400 text-xs uppercase font-bold mb-2">
                Détails Techniques (FR)
              </label>
              <textarea
                required
                rows={3}
                name="detailFR"
                value={form.detailFR}
                onChange={handleChange}
                className="w-full bg-black border border-neutral-800 p-3 focus:border-orange-500 outline-none"
              />
            </div>
          </div>

          <hr className="border-neutral-800 my-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-neutral-900 border border-neutral-800 p-4">
              <label className="block text-orange-500 text-xs uppercase font-bold mb-2">
                📷 Image Principale (Carrousel)
              </label>
              <input
                required
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="text-xs text-neutral-400"
              />
            </div>

            <div className="bg-neutral-900 border border-neutral-800 p-4">
              <label className="block text-orange-500 text-xs uppercase font-bold mb-2">
                🎥 Vidéo Loop (Section 2)
              </label>
              <input
                required
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                className="text-xs text-neutral-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black text-xs font-black uppercase tracking-widest py-4 skew-x-[-8deg] hover:bg-orange-500 transition-colors disabled:bg-neutral-800 disabled:text-neutral-600"
          >
            {loading
              ? "TRANSFERT MULTIMÉDIA CLOUDINARY..."
              : "PUBLIER LE PRODUIT"}
          </button>
        </form>
      </div>
    </main>
  );
}
