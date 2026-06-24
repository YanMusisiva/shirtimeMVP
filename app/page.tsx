"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

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

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lang, setLang] = useState<"FR" | "EN">("FR");
  const [isLightMode, setIsLightMode] = useState(false); // 🌓 Gestion du thème blanc

  useEffect(() => {
    const fetchPublicProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Erreur de chargement", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0c] text-white flex items-center justify-center font-mono text-xs uppercase tracking-widest animate-pulse">
        Chargement de l&apos;univers Shirtime...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-[#0b0b0c] text-white flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-orange-500 font-black text-xl tracking-wider uppercase mb-2">
          SHIRTIME LAB
        </h1>
        <p className="text-neutral-500 font-mono text-xs uppercase">
          Le catalogue est en cours de mise à jour.
        </p>
      </div>
    );
  }

  const currentProduct = products[activeIndex];

  return (
    // 🎨 On applique dynamiquement les styles de fond et texte selon 'isLightMode'
    <main
      className={`min-h-screen transition-colors duration-500 font-sans relative overflow-x-hidden selection:bg-orange-500 ${
        isLightMode ? "bg-[#f5f5f7] text-black" : "bg-[#0b0b0c] text-white"
      }`}
    >
      {/* BARRE DE NAVIGATION */}
      <header className="absolute top-0 left-0 w-full z-50 p-6 md:p-10 flex justify-between items-center mix-blend-difference">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 bg-white rounded-full p-0.5 animate-[spin_12s_linear_infinite]">
            <Image
              src="/file_0000000037946230a5bbd34766d5b786.png"
              alt="SHIRTIME"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-black tracking-widest text-sm uppercase italic text-white">
            SHIRTIME
          </span>
        </div>

        {/* Contrôles à droite : Thème + Langue */}
        <div className="flex items-center gap-2">
          {/* Bouton de Thème interactif */}
          <button
            onClick={() => setIsLightMode(!isLightMode)}
            className={`font-mono text-xs tracking-widest border px-3 py-1.5 transition uppercase ${
              isLightMode
                ? "border-neutral-400 bg-white text-black"
                : "border-neutral-800 bg-black/40 text-white"
            }`}
          >
            {isLightMode ? "🌙 MODE SOMBRE" : "☀️ MODE BLANC"}
          </button>

          <button
            onClick={() => setLang(lang === "FR" ? "EN" : "FR")}
            className={`font-mono text-xs tracking-widest border px-3 py-1.5 transition uppercase ${
              isLightMode
                ? "border-neutral-400 bg-white text-black"
                : "border-neutral-800 bg-black/40 text-white"
            }`}
          >
            🌐 {lang}
          </button>
        </div>
      </header>

      {/* SECTION 1 : LE CARROUSEL IMMERSIF */}
      <section className="min-h-screen grid grid-cols-1 lg:grid-cols-12 relative items-center pt-24 lg:pt-0">
        {/* Infos gauche */}
        <div className="lg:col-span-5 px-6 md:px-12 xl:px-20 space-y-6 z-10">
          <div className="space-y-1">
            <span className="font-mono text-xs text-orange-500 tracking-widest uppercase font-bold">
              [ {activeIndex + 1} / {products.length} ]
            </span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none block">
              {lang === "FR" ? currentProduct.nameFR : currentProduct.nameEN}
            </h2>
          </div>

          <p
            className={`text-sm font-light max-w-md leading-relaxed ${isLightMode ? "text-neutral-600" : "text-neutral-400"}`}
          >
            {lang === "FR" ? currentProduct.descFR : currentProduct.descEN}
          </p>

          <div className="pt-4 flex items-center gap-6">
            <span className="text-2xl font-mono font-black text-orange-500">
              {currentProduct.price}.00 $
            </span>
            <button
              className={`font-black text-xs uppercase tracking-widest px-6 py-3.5 skew-x-[-8deg] transition shadow-lg ${
                isLightMode
                  ? "bg-black text-white hover:bg-orange-500 hover:text-black"
                  : "bg-white text-black hover:bg-orange-500"
              }`}
            >
              {lang === "FR" ? "ACQUÉRIR L'ÉQUIPEMENT" : "ACQUIRE PIECE"}
            </button>
          </div>
        </div>

        {/* Visuel droit */}
        <div
          className={`lg:col-span-7 w-full h-[60vh] lg:min-h-screen relative transition-colors duration-500 ${
            isLightMode
              ? "bg-neutral-200 border-l border-neutral-300"
              : "bg-neutral-900 border-l border-neutral-950"
          }`}
        >
          <Image
            src={currentProduct.img}
            alt={currentProduct.nameFR}
            fill
            priority
            className={`object-cover contrast-125 brightness-95 transition-all duration-700 ${
              isLightMode
                ? "grayscale-0"
                : "grayscale contrast-125 brightness-90"
            }`}
            unoptimized
          />
          {/* Dégradé adaptatif */}
          <div
            className={`absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r via-transparent to-transparent ${
              isLightMode ? "from-[#f5f5f7]" : "from-[#0b0b0c]"
            }`}
          />
        </div>

        {/* Indicateurs de navigation */}
        <div className="absolute bottom-8 left-6 md:left-12 lg:left-20 flex gap-2 z-20">
          {products.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setActiveIndex(idx)}
              className={`h-2 transition-all duration-300 ${
                idx === activeIndex
                  ? "w-12 bg-orange-500"
                  : isLightMode
                    ? "w-3 bg-neutral-300 hover:bg-neutral-400"
                    : "w-3 bg-neutral-800 hover:bg-neutral-600"
              }`}
            />
          ))}
        </div>
      </section>

      {/* SECTION 2 : FOCUS TECHNIQUE & VIDÉO LOOP */}
      <section
        className={`transition-colors duration-500 py-20 px-6 md:px-12 xl:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
          isLightMode
            ? "bg-white border-t border-neutral-200"
            : "bg-black border-t border-neutral-900"
        }`}
      >
        {/* Conteneur Vidéo */}
        <div
          className={`relative w-full aspect-video overflow-hidden border transition-colors duration-500 ${
            isLightMode
              ? "bg-neutral-100 border-neutral-200"
              : "bg-neutral-950 border-neutral-900"
          }`}
        >
          <video
            key={currentProduct.video}
            autoPlay
            loop
            muted
            playsInline
            className={`w-full h-full object-cover transition duration-500 ${isLightMode ? "opacity-95" : "opacity-80"}`}
          >
            <source src={currentProduct.video} type="video/mp4" />
          </video>
          <div
            className={`absolute bottom-4 left-4 backdrop-blur-sm px-3 py-1 border font-mono text-[10px] uppercase tracking-widest ${
              isLightMode
                ? "bg-white/80 border-neutral-300 text-orange-600"
                : "bg-black/70 border-neutral-800 text-emerald-400"
            }`}
          >
            • Cloudinary Stream Active
          </div>
        </div>

        {/* Fiche Technique */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block mb-1">
              SPECIFICATIONS MATÉRIELLES
            </span>
            <h3 className="text-2xl font-black uppercase italic tracking-tight">
              {lang === "FR" ? "FICHE DÉTAILLÉE" : "TECHNICAL SPECIFICATIONS"}
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

      {/* PIED DE PAGE */}
      <footer
        className={`border-t py-8 px-6 text-center font-mono text-[10px] transition-colors duration-500 ${
          isLightMode
            ? "border-neutral-200 text-neutral-400"
            : "border-neutral-900 text-neutral-600"
        }`}
      >
        © {new Date().getFullYear()} SHIRTIME LABORATORY. ECOSYSTEM THEME
        ADAPTATION STABLE.
      </footer>
    </main>
  );
}
