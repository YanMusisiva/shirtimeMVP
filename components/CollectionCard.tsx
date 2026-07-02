"use client";
import { useState } from "react";
import Image from "next/image";

// 1. Alignement strict avec ton type de base de données Firestore
interface Product {
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
  categoryId?: string; // Liaison unique vers la catégorie
  likesCount?: number;
  likedBy?: string[];
}

interface CollectionCardProps {
  collectionId: string;
  categoryName: string; // Reçoit le nom de la catégorie résolu par la page principale
  vendorName: string;
  products: Product[];
  currentUserId: string;
  lang: "FR" | "EN";
  isLightMode: boolean;
  onAddToBasket: (product: Product) => void;
  onReachEnd: () => void;
  onOpen: (index: number) => void;
}

export default function CollectionCard({
  categoryName,
  vendorName,
  products,
  currentUserId,
  lang,
  isLightMode,
  onAddToBasket,
  onReachEnd,

  onOpen,
  // initialIndex = 0,
}: CollectionCardProps) {
  const [index, setIndex] = useState(0);

  // Sécurité si la catégorie ne contient aucun produit
  if (!products || products.length === 0) return null;

  const currentProduct = products[index];

  // ⚡ SÉCURITÉ LIKES : Si likedBy n'existe pas dans Firestore, on utilise [] par défaut
  const hasLikedCurrent = currentProduct.likedBy
    ? currentProduct.likedBy.includes(currentUserId)
    : false;

  const handleNext = () => {
    if (index < products.length - 1) {
      setIndex(index + 1);
    } else {
      onReachEnd(); // Déclenche le scroll automatique vers la catégorie suivante
    }
  };

  const handlePrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  return (
    <div
      className={`w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border transition-all duration-300 ${
        isLightMode
          ? "bg-white border-neutral-200 text-black"
          : "bg-[#09090b] border-neutral-900 text-white"
      }`}
    >
      {/* En-tête : Utilise le nom de la catégorie résolu à partir de l'ID */}
      <div className="p-4 flex justify-between items-center border-b border-neutral-800/10 dark:border-neutral-200/10">
        <div>
          <h3 className="text-sm font-black tracking-tight uppercase">
            {categoryName}
          </h3>
          <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
            by {vendorName}
          </p>
        </div>
        <span className="font-mono text-xs text-neutral-400">
          {index + 1}/{products.length}
        </span>
      </div>

      {/* Zone Image du Produit */}
      <div className="relative aspect-square w-full bg-neutral-900 group">
        <Image
          onClick={() => onOpen(index)}
          src={currentProduct.img}
          alt={lang === "FR" ? currentProduct.nameFR : currentProduct.nameEN}
          fill
          sizes="(max-w-md) 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={index === 0}
        />

        {/* Flèches de navigation */}
        {index > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full text-xs cursor-pointer transition"
          >
            ◀
          </button>
        )}
        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full text-xs cursor-pointer transition"
        >
          ▶
        </button>
      </div>

      {/* Corps et Actions de la carte */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-base">
              {lang === "FR" ? currentProduct.nameFR : currentProduct.nameEN}
            </h4>
            <p className="text-xs text-neutral-500 line-clamp-1">
              {lang === "FR" ? currentProduct.descFR : currentProduct.descEN}
            </p>
          </div>
          <span className="font-mono font-black text-lg text-red-500">
            {currentProduct.price}.00 $
          </span>
        </div>

        <div className="flex gap-2 pt-2">
          {/* Bouton Likes sécurisé contre le vide (fallback à 0) */}
          <button
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-mono transition cursor-pointer ${
              hasLikedCurrent
                ? "bg-red-500/10 border-red-500 text-red-500 font-bold"
                : "border-neutral-700 text-neutral-400 hover:text-white"
            }`}
          >
            <span>{hasLikedCurrent ? "❤️" : "🖤"}</span>
            <span>{currentProduct.likesCount || 0}</span>
          </button>

          {/* Bouton d'ajout au panier */}
          <button
            onClick={() => onAddToBasket(currentProduct)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-mono uppercase tracking-widest font-black py-3 px-4 rounded-xl transition shadow-lg cursor-pointer"
          >
            {lang === "FR" ? "🛒 Ajouter" : "🛒 Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
