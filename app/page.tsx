"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ClickClientModal from "../components/ClickClientModal";
import ClickCommentModal from "../components/ClickComment";
import SlideUpOnView from "@/components/SlideUpOnView";

type Product = {
  id: string;
  name: string;
  desc: string;
  detail: string;
  img: string;
  price?: string;
};

// Exemplaire unique de tableau de produits (prêt pour votre future partie admin)
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Premium T-Shirt",
    desc: "105% Coton - Coupe Moderne",
    detail:
      "Disponible en tailles S, M, L, XL. Lavable en machine à 30°C. Tissu respirant haut de gamme.",
    img: "/goma1.jpg",
    price: "25$",
  },
  {
    id: "2",
    name: "Nike Training Tracksuit",
    desc: "Confort & Performance",
    detail:
      "Idéal pour le sport ou le quotidien. Technologie Dri-FIT pour évacuer la transpiration.",
    img: "/goma2.jpg",
    price: "80$",
  },
  {
    id: "3",
    name: "Classic Polo",
    desc: "Style Élégant & Casual",
    detail:
      "Col boutonné ajusté, logo brodé sur la poitrine. Parfait pour les sorties décontractées.",
    img: "/goma3.jpg",
    price: "35$",
  },
  {
    id: "4",
    name: "Urban Hoodie",
    desc: "Collection Streetwear",
    detail:
      "Poche kangourou, capuche doublée avec cordon de serrage. Intérieur polaire doux.",
    img: "/goma4.jpg",
    price: "45$",
  },
  {
    id: "5",
    name: "Running Sneakers",
    desc: "Semelle amortissante",
    detail:
      "Conception ultra-légère. Adhérence maximale sur toutes surfaces pour vos sessions de running.",
    img: "/goma5.jpg",
    price: "95$",
  },
  {
    id: "6",
    name: "Minimalist Cap",
    desc: "Accessoire ajustable",
    detail:
      "100% coton lavé. Boucle métallique à l'arrière pour un ajustement parfait.",
    img: "/goma6.jpg",
    price: "15$",
  },
];

export default function Home() {
  const [openClientModal, setOpenClientModal] = useState(false);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState("");

  // Images pour le diaporama de la section Contact
  const contactImages = ["/jesper.jpg", "/dorcas.jpg", "/justine.jpg"];
  const [slideIndex, setSlideIndex] = useState(0);

  const handleOpenClientModal = (name: string) => {
    setSelectedProductName(name);
    setOpenClientModal(true);
  };

  const handleCloseClientModal = () => {
    setOpenClientModal(false);
    setSelectedProductName("");
  };

  // Effet pour le diaporama automatique de la section contact
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % contactImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [contactImages.length]);

  return (
    <main className="bg-white text-neutral-950 min-h-screen font-sans antialiased selection:bg-neutral-900 selection:text-white">
      {/* Header Minimaliste */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-100 px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="object-contain filter grayscale"
            priority
          />
          <span className="font-black text-xs tracking-widest uppercase">
            SHIRTIME
          </span>
        </div>
        <a
          href="#contact"
          className="text-xs uppercase tracking-widest font-bold border-b border-neutral-950 pb-0.5 hover:text-neutral-500 hover:border-neutral-400 transition"
        >
          Contact
        </a>
      </header>

      {/* Grille Principale des Produits - Immédiate sur Mobile */}
      <section className="py-6 px-4 max-w-7xl mx-auto">
        <div className="mb-6 block md:flex md:items-end justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold block mb-1">
              E-Shop
            </span>
            <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight">
              Our Collection
            </h1>
          </div>
          <span className="hidden md:inline text-xs font-mono text-neutral-400">
            {sampleProducts.length} Items
          </span>
        </div>

        {/* Grille optimisée : 2 colonnes d'office sur mobile pour un choix rapide de l'utilisateur */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-12">
          {sampleProducts.map((product: Product, idx: number) => (
            <SlideUpOnView
              key={product.id}
              delay={50 * idx}
              className="group flex flex-col"
            >
              <div
                className="relative w-full aspect-[3/4] bg-neutral-50 overflow-hidden cursor-pointer mb-3 rounded-none border border-neutral-100"
                onClick={() => handleOpenClientModal(product.name)}
              >
                <Image
                  src={product.img}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                {product.price && (
                  <div className="absolute bottom-2 right-2 bg-white px-2 py-0.5 text-xs font-bold shadow-sm">
                    {product.price}
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                <div>
                  <h3 className="text-xs md:text-sm font-bold uppercase tracking-wide text-neutral-900 truncate">
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-neutral-400 font-light truncate">
                    {product.desc}
                  </p>
                </div>
                <button
                  className="w-full sm:w-auto text-[10px] md:text-xs uppercase tracking-widest font-bold bg-neutral-950 text-white sm:bg-transparent sm:text-neutral-950 border border-neutral-900 sm:border-neutral-200 px-2.5 py-1.5 sm:py-1 hover:bg-neutral-950 hover:text-white transition text-center mt-1 sm:mt-0"
                  onClick={() => handleOpenClientModal(product.name)}
                >
                  Buy
                </button>
              </div>
            </SlideUpOnView>
          ))}
        </div>
      </section>

      {/* Section Détails des Produits (Si on descend plus bas) */}
      <section className="py-16 px-4 max-w-5xl mx-auto border-t border-neutral-200/60 mt-12">
        <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold block text-center mb-2">
          Zoom sur la qualité
        </span>
        <h2 className="text-xl md:text-2xl font-black text-center uppercase tracking-wider mb-10">
          Product Specifications &amp; Details
        </h2>

        <div className="space-y-8">
          {sampleProducts.map((product) => (
            <div
              key={`detail-${product.id}`}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 border-b border-neutral-100 items-baseline"
            >
              <h4 className="text-xs uppercase tracking-widest font-bold text-neutral-900">
                {product.name}
              </h4>
              <p className="text-xs text-neutral-400 uppercase tracking-wide italic">
                {product.desc}
              </p>
              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                {product.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Section Contact combinée avec le Diaporama Produit/Style */}
      <section
        id="contact"
        className="bg-neutral-950 text-white py-16 px-4 border-t border-neutral-800"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Diaporama intégré */}
          <div className="relative w-full aspect-[4/5] bg-neutral-900 overflow-hidden group">
            <Image
              src={contactImages[slideIndex]}
              alt="Lookbook Showcase"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-opacity duration-700 ease-in-out"
            />
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1 text-[9px] uppercase tracking-widest">
              Live Lookbook • {slideIndex + 1} / {contactImages.length}
            </div>
          </div>

          {/* Formulaire / Call To Action */}
          <div className="flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-2 block font-bold">
              Assistance &amp; Orders
            </span>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-4">
              We are here to serve you
            </h2>
            <p className="text-neutral-400 font-light text-xs md:text-sm leading-relaxed mb-8">
              For custom inquiries, sizing guides, or direct support about any
              item in our catalog, please reach out directly by sending a
              message.
            </p>
            <button
              className="w-full md:w-max bg-white text-neutral-950 text-xs uppercase tracking-widest px-8 py-4 font-bold hover:bg-neutral-200 transition"
              onClick={() => setOpenCommentModal(true)}
            >
              Your Message
            </button>
          </div>
        </div>
      </section>

      {/* Modals */}
      {openClientModal && (
        <ClickClientModal
          nameProduct={selectedProductName}
          onClose={handleCloseClientModal}
        />
      )}
      {openCommentModal && (
        <ClickCommentModal onClose={() => setOpenCommentModal(false)} />
      )}
    </main>
  );
}
