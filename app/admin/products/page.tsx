"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  nameEN: string;
  nameFR: string;
  descEN: string;
  descFR: string;
  detailEN: string;
  detailFR: string;
  price: number;
  img: string;
  video: string;
};

export default function ManageProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [message, setMessage] = useState("");
  const router = useRouter();

  // 1. PROTECTION DE LA PAGE PAR AUTHENTIFICATION
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/admin/login"); // Redirige si pas connecté
      } else {
        fetchProducts(); // Charge les données si connecté (Google ou Email)
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  // READ : Récupérer le catalogue
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Déclencher le mode édition en ligne
  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm(product);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // UPDATE : Envoi des modifications textuelles (incluant les liens Cloudinary existants)
  const handleUpdate = async (id: string) => {
    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editForm,
          id,
          price: parseFloat(String(editForm.price)),
        }),
      });

      if (res.ok) {
        setMessage("🎉 Modifications enregistrées !");
        setEditingId(null);
        fetchProducts();
      }
    } catch (err) {
      setMessage("❌ Erreur lors de la mise à jour");
    }
  };

  // DELETE : Supprimer la fiche de Firestore
  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer définitivement ce produit de la boutique ?"))
      return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("🗑️ Produit retiré avec succès.");
        fetchProducts();
      }
    } catch (err) {
      setMessage("❌ Erreur de suppression");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0b0b0c] text-center pt-24 font-mono text-xs text-neutral-500">
        VÉRIFICATION CLÉS COMPTE ADMIN...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0b0c] text-white p-6 md:p-12 font-sans selection:bg-orange-500">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-neutral-800 pb-4">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-wider text-orange-500 italic">
              SHIRTIME CONTROL PANEL
            </h1>
            <p className="text-neutral-400 text-xs uppercase tracking-widest">
              Connecté avec succès • Gestion CRUD & Cloudinary
            </p>
          </div>
          <div className="flex gap-4">
            <a
              href="/admin/add-product"
              className="bg-white text-black font-black text-xs uppercase tracking-widest px-4 py-2.5 skew-x-[-8deg] hover:bg-orange-500 transition"
            >
              + Ajouter produit
            </a>
            <button
              onClick={handleLogout}
              className="border border-neutral-800 text-neutral-400 text-xs px-3 hover:text-white transition"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {message && (
          <div className="p-4 mb-6 bg-neutral-900 border border-neutral-800 text-xs font-mono text-orange-400">
            {message}
          </div>
        )}

        {loading ? (
          <p className="text-center font-mono text-xs text-neutral-500 py-12">
            CHARGEMENT DES DONNÉES CATALOGUE...
          </p>
        ) : products.length === 0 ? (
          <p className="text-center font-mono text-xs text-neutral-500 py-12">
            AUCUN APPAREIL ENREGISTRÉ DANS LA BASE DE DONNÉES.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-[#111112] border border-neutral-800 p-6 flex flex-col md:flex-row gap-6 relative items-start"
              >
                {/* Miniature Cloudinary Image */}
                <div className="w-full md:w-32 h-40 relative bg-neutral-900 flex-shrink-0 border border-neutral-800">
                  <Image
                    src={product.img}
                    alt={product.nameFR}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {editingId === product.id ? (
                  <div className="flex-1 w-full space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        name="nameFR"
                        value={editForm.nameFR || ""}
                        onChange={handleEditChange}
                        className="bg-black border border-neutral-800 p-2 text-white outline-none"
                      />
                      <input
                        type="text"
                        name="nameEN"
                        value={editForm.nameEN || ""}
                        onChange={handleEditChange}
                        className="bg-black border border-neutral-800 p-2 text-white outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <textarea
                        name="descFR"
                        value={editForm.descFR || ""}
                        onChange={handleEditChange}
                        className="bg-black border border-neutral-800 p-2 text-white outline-none"
                      />
                      <textarea
                        name="descEN"
                        value={editForm.descEN || ""}
                        onChange={handleEditChange}
                        className="bg-black border border-neutral-800 p-2 text-white outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        name="price"
                        value={editForm.price || ""}
                        onChange={handleEditChange}
                        className="bg-black border border-neutral-800 p-2 text-white w-32 outline-none"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleUpdate(product.id)}
                        className="bg-orange-500 text-black px-4 py-2 font-bold uppercase tracking-widest text-[10px]"
                      >
                        Sauvegarder
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-neutral-800 text-white px-4 py-2 font-bold uppercase tracking-widest text-[10px]"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-black uppercase italic tracking-tight">
                        {product.nameFR}
                      </h2>
                      <span className="font-mono text-xs text-orange-400 bg-neutral-900 border border-neutral-800 px-2 py-0.5">
                        {product.price}.00 $
                      </span>
                    </div>
                    <p className="text-neutral-400 text-xs font-light max-w-2xl">
                      {product.descFR}
                    </p>
                    <div className="text-[10px] text-neutral-500 font-mono flex flex-col gap-1 pt-2">
                      <span>ID du produit : {product.id}</span>
                      <span className="text-neutral-600 truncate max-w-lg">
                        🔗 URL Vidéo Cloudinary : {product.video}
                      </span>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-neutral-800/40 mt-4">
                      <button
                        onClick={() => startEdit(product)}
                        className="border border-neutral-700 text-neutral-300 text-[10px] uppercase tracking-widest px-3 py-1.5 hover:border-orange-500 hover:text-white transition"
                      >
                        ✏️ Modifier textes
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="border border-red-900/60 text-red-400 text-[10px] uppercase tracking-widest px-3 py-1.5 hover:bg-red-950/40 transition"
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
