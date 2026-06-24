"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ClickClientModal from "../components/ClickClientModal";
import ClickCommentModal from "../components/ClickComment";

const translations = {
  fr: {
    addToCart: "Ajouter au Panier",
    added: "Ajouté !",
    contact: "Passer Commande",
    detailsTitle: "Spécifications du Produit",
    cartTitle: "Votre Panier",
    emptyCart: "Le panier est vide.",
    checkout: "Confirmer la sélection",
    featured: "Collection exclusive",
    specs: "Caractéristiques",
  },
  en: {
    addToCart: "Add to Cart",
    added: "Added!",
    contact: "Order Now",
    detailsTitle: "Product Specifications",
    cartTitle: "Your Cart",
    emptyCart: "Your cart is empty.",
    checkout: "Confirm Selection",
    featured: "Exclusive Collection",
    specs: "Specifications",
  },
};

type Product = {
  id: string;
  tag: string;
  nameEN: string;
  nameFR: string;
  descEN: string;
  descFR: string;
  detailEN: string;
  detailFR: string;
  img: string;
  video?: string;
  price: string;
};

// Tableau d'exemples de produits que l'utilisateur fait défiler avec les flèches
const targetProducts: Product[] = [
  {
    id: "shirtime-01",
    tag: "NIKE",
    nameEN: "Air Tracksuit Tech",
    nameFR: "Survêtement Air Tech",
    descEN: "Engineered for superior comfort and warm retention.",
    descFR:
      "Conçu pour un confort supérieur et une rétention thermique optimale.",
    detailEN:
      "Ergonomic hood design with high-stretch tailored fibers. Premium reflective branding elements.",
    detailFR:
      "Design de capuche ergonomique avec fibres ajustées ultra-extensibles. Éléments réfléchissants premium.",
    img: "/goma2.jpg",
    video: "/product-detail-1.mp4",
    price: "85$",
  },
  {
    id: "shirtime-02",
    tag: "URBAN",
    nameEN: "AeroTech Street Hoodie",
    nameFR: "Sweat Urban AeroTech",
    descEN: "Heavyweight premium cotton blend built for the modern look.",
    descFR:
      "Mélange de coton lourd premium conçu pour un look moderne et streetwear.",
    detailEN:
      "Reinforced structural stitching with double-lined insulation pocket. Oversized loose-fit architecture.",
    detailFR:
      "Coutures structurelles renforcées avec poche d'isolation doublée. Architecture coupe ample surdimensionnée.",
    img: "/goma4.jpg",
    video: "/product-detail-2.mp4",
    price: "65$",
  },
  {
    id: "shirtime-03",
    tag: "SPORTS",
    nameEN: "Classic Flex Polo",
    nameFR: "Polo Classic Flex",
    descEN: "Breathable airflow knit designed for everyday versatility.",
    descFR:
      "Tricot respirant à flux d'air conçu pour une polyvalence quotidienne.",
    detailEN:
      "Moisture-wicking microfibers keep your skin dry. Tailored flat-knit collar with premium buttons.",
    detailFR:
      "Microfibres évacuant l'humidité pour garder la peau au sec. Col en tricot plat ajusté avec boutons premium.",
    img: "/goma3.jpg",
    price: "40$",
  },
];

export default function Home() {
  const [lang, setLang] = useState<"fr" | "en">("en");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cart, setCart] = useState<
    { id: string; name: string; price: string; quantity: number }[]
  >([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [openCommentModal, setOpenCommentModal] = useState(false);

  const t = translations[lang];
  const activeProduct = targetProducts[currentIndex];

  useEffect(() => {
    const systemLang = navigator.language || (navigator as any).userLanguage;
    if (systemLang?.startsWith("fr")) setLang("fr");

    const savedCart = localStorage.getItem("shirtime_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleAddToCart = () => {
    let updatedCart = [...cart];
    const productName =
      lang === "en" ? activeProduct.nameEN : activeProduct.nameFR;
    const existing = updatedCart.find((item) => item.id === activeProduct.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      updatedCart.push({
        id: activeProduct.id,
        name: productName,
        price: activeProduct.price,
        quantity: 1,
      });
    }

    setCart(updatedCart);
    localStorage.setItem("shirtime_cart", JSON.stringify(updatedCart));

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % targetProducts.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + targetProducts.length) % targetProducts.length,
    );
  };

  const removeItem = (id: string) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    localStorage.setItem("shirtime_cart", JSON.stringify(updated));
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <main className="bg-[#0b0c10] text-[#f5f5f7] min-h-screen font-sans antialiased selection:bg-[#ff4500] selection:text-white overflow-x-hidden">
      {/* Header Sombre Minimaliste */}
      <header className="sticky top-0 z-50 bg-[#0b0c10]/90 backdrop-blur-md border-b border-neutral-900 px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo"
            width={35}
            height={35}
            className="object-contain filter invert brightness-200"
            priority
          />
          <span className="font-black text-xs tracking-widest text-white">
            SHIRTIME
          </span>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <button
            onClick={() => setLang(lang === "en" ? "fr" : "en")}
            className="text-[10px] font-mono tracking-widest border border-neutral-800 px-2 py-1 rounded text-neutral-400 hover:text-white transition"
          >
            {lang === "en" ? "FR" : "EN"}
          </button>

          {/* Bouton Panier Interactif */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-neutral-300 hover:text-[#ff4500] transition"
          >
            <span>🛒</span>
            <span className="absolute -top-2 -right-2 bg-[#ff4500] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
              {totalItems}
            </span>
          </button>

          <button
            onClick={() => setOpenCommentModal(true)}
            className="text-xs uppercase tracking-widest font-bold bg-[#ff4500] text-white px-3 py-1.5 hover:bg-[#e03d00] transition shadow-md shadow-[#ff4500]/20"
          >
            {t.contact}
          </button>
        </div>
      </header>

      {/* SECTION BANNER HERO UNIQUE AVEC DÉFILEMENT DE PRODUITS */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 overflow-hidden py-12">
        {/* Texte Géant en Arrière-plan (Effet Basketball/Sport Site) */}
        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none z-0 overflow-hidden">
          <h1 className="text-[14vw] font-black text-neutral-900/40 uppercase tracking-tighter leading-none animate-pulse">
            {activeProduct.tag}
          </h1>
        </div>

        <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Infos Produit à Gauche */}
          <div className="md:col-span-5 flex flex-col justify-center text-center md:text-left order-2 md:order-1">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#ff4500] font-black mb-2 block">
              {t.featured}
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4 text-white transition-all duration-300">
              {lang === "en" ? activeProduct.nameEN : activeProduct.nameFR}
            </h2>
            <p className="text-neutral-400 text-sm font-light leading-relaxed mb-6 max-w-sm mx-auto md:mx-0">
              {lang === "en" ? activeProduct.descEN : activeProduct.descFR}
            </p>
            <div className="text-2xl font-mono font-bold text-white mb-6">
              {activeProduct.price}
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full md:w-max text-xs uppercase tracking-widest font-black py-4 px-8 transition-all duration-300 shadow-lg ${
                isAdded
                  ? "bg-emerald-600 text-white shadow-emerald-900/20"
                  : "bg-white text-black hover:bg-[#ff4500] hover:text-white shadow-[#ff4500]/10"
              }`}
            >
              {isAdded ? `✓ ${t.added}` : t.addToCart}
            </button>
          </div>

          {/* Cadre Image/Media avec Flèches de Navigation à Droite */}
          <div className="md:col-span-7 relative flex justify-center items-center order-1 md:order-2">
            <div className="relative w-full aspect-[4/5] sm:aspect-[16/13] bg-[#12131a] border border-neutral-900 overflow-hidden group shadow-2xl">
              <Image
                src={activeProduct.img}
                alt={activeProduct.nameEN}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
            </div>

            {/* Boutons Flèches Flottants (Jeux de couleurs et contrôles) */}
            <div className="absolute bottom-4 right-4 flex gap-2 z-20">
              <button
                onClick={handlePrev}
                className="w-12 h-12 bg-[#0b0c10] border border-neutral-800 text-white flex items-center justify-center hover:bg-[#ff4500] hover:border-[#ff4500] transition-all duration-200"
              >
                ←
              </button>
              <button
                onClick={handleNext}
                className="w-12 h-12 bg-[#0b0c10] border border-neutral-800 text-white flex items-center justify-center hover:bg-[#ff4500] hover:border-[#ff4500] transition-all duration-200"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION DETAILS EN DESSOUS AVEC VIDÉO OU MACRO COMPORTEMENT */}
      <section className="bg-[#12131a] py-24 px-4 border-t border-neutral-900 relative z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Zone Média interactive : Vidéo loop animée */}
          <div className="relative w-full aspect-[4/5] bg-black border border-neutral-800 overflow-hidden group shadow-xl">
            {activeProduct.video ? (
              <video
                src={activeProduct.video}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={activeProduct.img}
                  alt="Product Spec"
                  fill
                  className="object-cover opacity-80 transform group-hover:scale-110 transition-transform duration-[2000ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              </div>
            )}
            <div className="absolute top-4 left-4 bg-[#ff4500] text-[9px] text-white tracking-widest uppercase px-2 py-0.5 font-bold">
              {t.specs}
            </div>
          </div>

          {/* Textes explicatifs détaillés */}
          <div className="flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#ff4500] font-bold mb-2">
              Shirtime Lab Specs
            </span>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-6 text-white">
              {t.detailsTitle}
            </h2>
            <div className="text-neutral-400 font-light text-sm leading-relaxed border-l-2 border-[#ff4500] pl-6 py-2 bg-[#0b0c10]/40 rounded-r pr-4">
              {lang === "en" ? activeProduct.detailEN : activeProduct.detailFR}
            </div>
          </div>
        </div>
      </section>

      {/* DRAWER PANIER LATÉRAL (S'ouvre sur le côté de l'écran) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div
            className="absolute inset-0"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="relative w-full max-w-md bg-[#0b0c10] h-full shadow-2xl p-6 flex flex-col justify-between border-l border-neutral-900 z-10">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-neutral-900 mb-6">
                <h3 className="text-md font-black uppercase tracking-widest text-white">
                  {t.cartTitle}
                </h3>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-neutral-400 hover:text-white text-sm font-mono"
                >
                  ✕ Close
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-neutral-500 text-xs uppercase tracking-wider py-8 text-center">
                  {t.emptyCart}
                </p>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center bg-[#12131a] p-3 border border-neutral-900"
                    >
                      <div>
                        <h4 className="text-xs uppercase tracking-wider font-bold text-white">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                          {item.price} × {item.quantity}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[10px] text-red-500 hover:text-red-400 uppercase tracking-widest font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setOpenCommentModal(true);
                }}
                className="w-full bg-[#ff4500] text-white text-xs uppercase tracking-widest font-black py-4 hover:bg-[#e03d00] transition"
              >
                {t.checkout} ({totalItems})
              </button>
            )}
          </div>
        </div>
      )}

      {/* Footer Modals */}
      {openCommentModal && (
        <ClickCommentModal onClose={() => setOpenCommentModal(false)} />
      )}
    </main>
  );
}
