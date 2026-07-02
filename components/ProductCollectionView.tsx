"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

export type Category = {
  id: string;
  nameFR: string;
  nameEN: string;
};

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
  categoryId?: string;

  // ⚡ Ajout des sécurités pour les fonctionnalités interactives du flux (Likes)
  likesCount?: number; // Optionnel : initialisé par défaut à 0 dans le code si absent
  likedBy?: string[]; // Optionnel : tableau d'IDs utilisateurs, évite l'erreur .includes()

  // ⚡ Comme le champ vendorName ou collectionName n'existe pas dans le document produit,
  // on utilise le type optionnel au cas où tu l'ajoutes plus tard, sinon le code utilise
  // automatiquement des fallbacks dynamiques (ex: "SHIRTIME" ou le nom de la catégorie).
  vendorName?: string;
};

interface ProductCollectionViewProps {
  vendorId: string; // Reçu pour filtrer les produits de ce vendeur spécifique
  collectionName: string; // Nom de la collection à afficher si nécessaire
  initialIndex?: number; // Index initial du produit à afficher
  lang: "FR" | "EN";
  vendorName?: string;
  isLightMode: boolean;
  onClose: () => void; // Permet de fermer le focus pour revenir au flux principal
  onAddToBasket: (product: any) => void; // Connecté à la logique d'ajout globale
}

export default function ProductCollectionView({
  vendorId,
  collectionName,
  vendorName,
  lang,
  isLightMode,
  onClose,
  initialIndex = 0,
  onAddToBasket,
}: ProductCollectionViewProps & { initialIndex?: number }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Chargement initial des données filtrées par le vendorId reçu
  useEffect(() => {
    async function loadCategoryProducts() {
      try {
        setLoading(true);

        // 1. On appelle ton API globale de produits
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Erreur serveur lors de la récupération");

        const allProducts: Product[] = await res.json();

        // 2. ⚡ LE FILTRE MAGIQUE :
        // On compare le 'categoryId' du produit avec la prop 'vendorId' reçue (qui contient l'ID de la collection)
        const filtered = allProducts.filter((p) => p.categoryId === vendorId);

        setProducts(filtered);
      } catch (error) {
        console.error("Erreur filtrage produits :", error);
      } finally {
        setLoading(false);
      }
    }

    if (vendorId) {
      loadCategoryProducts();
    }
  }, [vendorId]); // ⚡ Se déclenche dès que tu cliques sur une catégorie différente

  // --- NAVIGATION DU CARROUSEL ---
  const handlePrev = () => {
    if (filteredProducts.length === 0) return;
    setActiveIndex((prev) =>
      prev === 0 ? filteredProducts.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    if (filteredProducts.length === 0) return;
    setActiveIndex((prev) =>
      prev === filteredProducts.length - 1 ? 0 : prev + 1,
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;

    if (diffX > 50) handleNext();
    else if (diffX < -50) handlePrev();
    setTouchStartX(null);
  };

  // --- FILTRAGE DES PRODUITS ---
  const filteredProducts = products.filter((p) => {
    if (!p.categoryId && categories.length > 0) {
      return activeCategoryId === categories[0].id;
    }
    return p.categoryId === activeCategoryId;
  });

  const currentProduct =
    filteredProducts[activeIndex] || filteredProducts[0] || products[0];

  if (!currentProduct) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center text-center p-4">
        <p className="text-neutral-500 font-mono text-xs uppercase animate-pulse">
          {lang === "FR"
            ? "Chargement de la collection..."
            : "Loading collection..."}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto ${
        isLightMode ? "bg-[#f5f5f7] text-black" : "bg-[#0b0b0c] text-white"
      }`}
    >
      {/* ✕ BOUTON FLOUTÉ POUR RETOURNER AU FEED PRINCIPAL */}
      <button
        onClick={onClose}
        className="fixed top-4 left-4 z-50 px-3 py-2 text-[10px] font-mono uppercase tracking-widest border border-neutral-800 rounded-2xl bg-black/60 text-white backdrop-blur-md hover:bg-neutral-950 transition cursor-pointer select-none"
      >
        ✕ {lang === "FR" ? "Retour au flux" : "Back to feed"}
      </button>

      {/* CARROUSEL IMMERSIF (CONSERVE TON IDENTITÉ VISUELLE) */}
      <section
        className="min-h-screen flex flex-col justify-start relative pt-12 touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Zone Visuelle Principale (Hauteur gérée comme ton Beryl Shop) */}
        <div className="w-full h-[55vh] md:h-[65vh] relative group select-none">
          {/* 🏷️ BOUTON CATÉGORIE FLOTTANT */}
          <div className="absolute top-4 left-4 z-30 font-mono">
            <button
              onClick={(e) => {
                e.stopPropagation(); // Évite le déclenchement du zoom image
                setIsDropdownOpen(!isDropdownOpen);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] tracking-widest uppercase cursor-pointer transition-all duration-300 backdrop-blur-md border border-white/10 bg-black/40 text-neutral-300 hover:text-white hover:bg-black/70 hover:scale-105 shadow-lg select-none"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span>{lang === "FR" ? "Collection : " : "Collection: "}</span>
              <span className="font-bold text-white tracking-wider">
                {categories.find((c) => c.id === activeCategoryId)?.[
                  lang === "FR" ? "nameFR" : "nameEN"
                ] ||
                  collectionName ||
                  "T-SHIRTS"}
              </span>
              <span
                className={`text-[8px] transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </button>

            {/* Menu Déroulant Fluide */}
            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute top-9 left-0 bg-black/90 border border-neutral-800 p-1.5 rounded-md flex flex-col gap-0.5 min-w-[160px] z-50 shadow-2xl backdrop-blur-lg animate-in fade-in slide-in-from-top-2 duration-200">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCategoryId(cat.id);
                        setActiveIndex(0);
                        setIsDropdownOpen(false);
                      }}
                      className={`text-left text-[9px] p-2 tracking-widest uppercase transition-all duration-200 rounded-sm cursor-pointer ${
                        activeCategoryId === cat.id
                          ? "bg-white text-black font-bold"
                          : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                      }`}
                    >
                      {lang === "FR" ? cat.nameFR : cat.nameEN}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Flèches Tactiques de navigation */}
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between items-center z-30 pointer-events-none">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-neutral-700/80 bg-black/60 text-white flex items-center justify-center text-lg font-black transition active:scale-90 pointer-events-auto cursor-pointer hover:bg-red-600"
            >
              ‹
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-neutral-700/80 bg-black/60 text-white flex items-center justify-center text-lg font-black transition active:scale-90 pointer-events-auto cursor-pointer hover:bg-red-600"
            >
              ›
            </button>
          </div>

          {/* Image cliquable pour ouvrir le Zoom */}
          <div
            className="w-full h-full relative cursor-zoom-in"
            onClick={() => setIsZoomOpen(true)}
          >
            <Image
              src={currentProduct.img}
              alt={
                lang === "FR" ? currentProduct.nameFR : currentProduct.nameEN
              }
              fill
              priority
              loading="eager"
              className={`object-cover contrast-125 transition-all duration-700 ${
                isLightMode
                  ? "grayscale-0 brightness-95 contrast-100"
                  : "grayscale-0 contrast-110 brightness-90"
              }`}
              unoptimized
            />
            <div
              className={`absolute inset-0 bg-linear-to-t via-transparent to-transparent ${
                isLightMode ? "from-[#f5f5f7]" : "from-[#0b0b0c]"
              }`}
            />
          </div>
        </div>

        {/* Zone d'information et d'actions (SOUS l'image) */}
        <div className="w-full max-w-4xl mx-auto px-6 md:px-12 py-8 text-center space-y-6 z-10">
          <div className="space-y-2">
            <span className="font-mono text-xs text-red-600 tracking-widest uppercase font-bold block">
              [ {activeIndex + 1} / {filteredProducts.length} ]
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic leading-none">
              {lang === "FR" ? currentProduct.nameFR : currentProduct.nameEN}
            </h2>
            <span className="text-xl font-mono font-black text-red-600 block pt-1">
              {currentProduct.price}.00 $
            </span>
          </div>

          <p
            className={`text-sm font-light max-w-2xl mx-auto leading-relaxed ${isLightMode ? "text-neutral-600" : "text-neutral-400"}`}
          >
            {lang === "FR" ? currentProduct.descFR : currentProduct.descEN}
          </p>

          <div className="pt-2 flex flex-col items-center gap-4 justify-center">
            <button
              onClick={() => onAddToBasket(currentProduct)}
              className={`font-black text-xs uppercase tracking-widest px-10 py-4 skew-x-[-8deg] transition shadow-lg cursor-pointer ${
                isLightMode
                  ? "bg-black text-white hover:bg-red-600"
                  : "bg-white text-black hover:bg-red-600 hover:text-white"
              }`}
            >
              {lang === "FR" ? "AJOUTER AU PANIER" : "ADD TO CART"}
            </button>

            {/* 🆕 LOGIQUE FIN DE CARROUSEL : Si on est sur le dernier produit, affiche le bouton de retour au feed */}
            {activeIndex === filteredProducts.length - 1 && (
              <button
                onClick={onClose}
                className="mt-2 font-mono text-[10px] tracking-widest text-red-500 hover:underline uppercase cursor-pointer bg-neutral-900/40 px-4 py-2 border border-neutral-800 rounded-2xl"
              >
                {lang === "FR"
                  ? "👉 Découvrir d'autres collections"
                  : "👉 Explore more collections"}
              </button>
            )}
          </div>

          {/* Points indicateurs horizontaux */}
          <div className="flex justify-center gap-2 pt-4">
            {filteredProducts.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setActiveIndex(idx)}
                className={`h-1.5 transition-all duration-300 cursor-pointer ${
                  idx === activeIndex
                    ? "w-10 bg-red-600"
                    : isLightMode
                      ? "w-2 bg-neutral-300"
                      : "w-2 bg-neutral-800"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* MODAL DE ZOOM ULTRA-HAUTE QUALITÉ */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-md"
          onClick={() => setIsZoomOpen(false)}
        >
          <button
            className="absolute top-6 right-6 text-white text-xl font-mono p-4 z-50 bg-black/40 rounded-full border border-neutral-800 hover:text-red-500 cursor-pointer transition"
            onClick={() => setIsZoomOpen(false)}
          >
            ✕
          </button>
          <div
            className="relative w-full h-full max-w-5xl max-h-[85vh] p-4 flex items-center justify-center overflow-auto touch-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentProduct.img}
              alt="Zoomed View"
              className="max-w-full max-h-full object-contain rounded-xs select-none"
            />
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] text-neutral-500 uppercase tracking-widest text-center pointer-events-none">
            {lang === "FR"
              ? "📱 Écartez les doigts pour zoomer"
              : "📱 Pinch to zoom artwork"}
          </div>
        </div>
      )}

      {/* SECTION FOCUS TECHNIQUE & VIDÉO LOOP 9:16 */}
      <section
        className={`transition-colors duration-500 py-20 px-6 md:px-12 xl:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
          isLightMode
            ? "bg-white border-t border-neutral-200"
            : "bg-black border-t border-neutral-900"
        }`}
      >
        <div className="flex justify-center items-center w-full py-4">
          <div
            className={`relative w-full max-w-[360px] aspect-[9/16] overflow-hidden border rounded-md transition-colors duration-500 shadow-2xl group cursor-pointer ${
              isLightMode
                ? "bg-neutral-100 border-neutral-200"
                : "bg-neutral-950 border-neutral-900"
            }`}
            onClick={(e) => {
              const videoEl = e.currentTarget.querySelector("video");
              if (videoEl) {
                if (videoEl.muted) videoEl.muted = false;
                if (videoEl.paused) videoEl.play();
                else videoEl.pause();
              }
            }}
          >
            <video
              key={currentProduct.video}
              loop
              muted
              playsInline
              className={`w-full h-full object-cover transition duration-500 ${isLightMode ? "opacity-95" : "opacity-80"}`}
              ref={(el) => {
                if (!el) return;
                const observer = new IntersectionObserver(
                  ([entry]) => {
                    if (entry.isIntersecting) {
                      el.play().catch((err) =>
                        console.log("Lecture bloquée :", err),
                      );
                    } else {
                      el.pause();
                    }
                  },
                  { threshold: 0.6 },
                );
                observer.observe(el);
              }}
            >
              <source src={currentProduct.video} type="video/mp4" />
            </video>
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-black/60 backdrop-blur-xs p-4 rounded-full text-white text-xs font-mono uppercase tracking-widest border border-neutral-800">
                🔊 Activer le son / Pause
              </div>
            </div>
            <div
              className={`absolute bottom-4 left-4 backdrop-blur-sm px-3 py-1 border font-mono text-[10px] uppercase tracking-widest z-10 ${
                isLightMode
                  ? "bg-white/80 border-neutral-300 text-red-600"
                  : "bg-black/70 border-neutral-800 text-red-500"
              }`}
            >
              • Auto Play Scroll Active
            </div>
          </div>
        </div>

        {/* Fiche Technique */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block mb-1">
              SPECIFICATIONS
            </span>
            <h3 className="text-2xl font-black uppercase italic tracking-tight">
              DETAILS
            </h3>
          </div>
          <p
            className={`text-sm font-light leading-relaxed whitespace-pre-line p-6 border font-mono transition-colors duration-500 ${
              isLightMode
                ? "bg-neutral-50 border-neutral-200 text-neutral-800"
                : "bg-neutral-900/40 border-neutral-900 text-neutral-400"
            }`}
          >
            {lang === "FR" ? currentProduct.detailFR : currentProduct.detailEN}
          </p>
        </div>
      </section>
    </div>
  );
}
