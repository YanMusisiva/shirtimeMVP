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

type CartItem = {
  product: Product;
  quantity: number;
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lang, setLang] = useState<"FR" | "EN">("FR");
  const [isLightMode, setIsLightMode] = useState(false);

  // 🛒 Gestion du Panier & Sidebar
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 📱 Pour détecter le Swipe sur mobile
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Numéro WhatsApp de destination (Ex: "243xxxxxxxxx" ou "336xxxxxxxxx" sans le +)
  const WHATSAPP_NUMBER = "243000000000";

  // Chargement initial (Produits + Panier stocké)
  useEffect(() => {
    const initializeShop = async () => {
      try {
        // 1. On charge d'abord les produits de l'API
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }

        // 2. On charge le panier depuis le LocalStorage en toute sécurité
        const savedCart = localStorage.getItem("shirtime_cart");
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart)) {
            const validCart = parsedCart.filter(
              (item) => item && item.product && item.product.id,
            );
            setCart(validCart);
          }
        }
      } catch (err) {
        console.error("Erreur lors de l'initialisation de la boutique", err);
      } finally {
        // 3. QUOI QU'IL ARRIVE (Succès ou Erreur), on enlève le chargement
        setLoading(false);
      }
    };

    initializeShop();
  }, []); // S'exécute une seule fois au montage du composant

  // --- ACTIONS DU PANIER ---
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    setIsCartOpen(true); // Ouvre le panier pour donner un feedback visuel immédiat (comme sur le site exemple)
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const getCartTotal = () => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // --- ENVOI DE LA COMMANDE WHATSAPP ---
  const sendWhatsAppOrder = () => {
    if (cart.length === 0) return;

    let message =
      lang === "FR"
        ? `🔴 *NOUVELLE COMMANDE SHIRTIME SHOP*\n\n`
        : `🔴 *NEW SHIRTIME SHOP ORDER*\n\n`;

    cart.forEach((item, index) => {
      const name = lang === "FR" ? item.product.nameFR : item.product.nameEN;
      message += `${index + 1}. *${name}*\n   Ref: ${item.product.id}\n   Qté: ${item.quantity} x ${item.product.price}$ = *${item.product.price * item.quantity}$*\n\n`;
    });

    message += `───────────────────\n`;
    message +=
      lang === "FR"
        ? `💰 *TOTAL DE LA COMMANDE : ${getCartTotal()}$*`
        : `💰 *TOTAL ORDER : ${getCartTotal()}$*`;

    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`,
      "_blank",
    );
  };

  // --- NAVIGATION DU CARROUSEL ---
  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  // --- GESTION DU SWIPE MATÉRIEL ---
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;

    if (diffX > 50) {
      handleNext(); // Glissement vers la gauche -> suivant
    } else if (diffX < -50) {
      handlePrev(); // Glissement vers la droite -> précédent
    }
    setTouchStartX(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0c] text-white flex items-center justify-center font-mono text-xs uppercase tracking-widest animate-pulse">
        Chargement Shirtime Shop...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-[#0b0b0c] text-white flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-red-600 font-black text-xl tracking-wider uppercase mb-2">
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
    <main
      className={`min-h-screen transition-colors duration-500 font-sans relative overflow-x-hidden selection:bg-red-600 ${
        isLightMode ? "bg-[#f5f5f7] text-black" : "bg-[#0b0b0c] text-white"
      }`}
    >
      {/* 🔴 OVERLAY SIDEBAR DU PANIER INTERACTIF (Style Vercel/Beryl Shop) */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity duration-300 ${
          isCartOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] z-50 shadow-2xl transition-transform duration-500 flex flex-col font-mono text-xs border-l ${
          isLightMode
            ? "bg-white border-neutral-200 text-black"
            : "bg-[#0d0d0e] border-neutral-900 text-white"
        } ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-black/10">
          <span className="font-black text-sm tracking-widest">
            🛒 MON PANIER ({getCartItemsCount()})
          </span>
          <button
            onClick={() => setIsCartOpen(false)}
            className="hover:text-red-500 p-2 text-base transition font-bold"
          >
            ✕
          </button>
        </div>

        {/* Liste du Panier */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 space-y-2 py-20">
              <span className="text-3xl">🕳️</span>
              <p className="uppercase tracking-wider">Votre panier est vide</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 p-3 border border-neutral-800/60 bg-neutral-900/10 rounded-sm relative group items-center"
              >
                <div className="relative w-16 h-16 bg-neutral-900 overflow-hidden shrink-0 border border-neutral-800">
                  <Image
                    src={item.product.img}
                    alt={item.product.nameFR}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold uppercase tracking-tight truncate text-sm">
                    {lang === "FR" ? item.product.nameFR : item.product.nameEN}
                  </h4>
                  <span className="text-red-500 font-bold block mt-0.5">
                    {item.product.price * item.quantity}.00 $
                  </span>

                  {/* Selecteur de Quantité premium */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="w-6 h-6 border border-neutral-700 hover:border-red-500 flex items-center justify-center active:scale-95 transition"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="w-6 h-6 border border-neutral-700 hover:border-red-500 flex items-center justify-center active:scale-95 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer de la Sidebar */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-neutral-800 bg-black/20 space-y-4">
            <div className="flex justify-between items-center text-sm font-black tracking-widest">
              <span>TOTAL :</span>
              <span className="text-red-500 text-lg">
                {getCartTotal()}.00 $
              </span>
            </div>
            <button
              onClick={sendWhatsAppOrder}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              💬 CONFIRMER VIA WHATSAPP
            </button>
          </div>
        )}
      </div>

      {/* BARRE DE NAVIGATION */}
      <header className="absolute top-0 left-0 w-full z-40 p-6 md:p-10 flex justify-between items-center mix-blend-difference">
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

        {/* Contrôles à droite */}
        <div className="flex items-center gap-2">
          {/* Bouton Panier flottant de la navbar */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="font-mono text-xs tracking-widest border border-red-600 bg-red-600 text-white px-3 py-1.5 transition uppercase font-black hover:bg-transparent hover:text-red-500 relative cursor-pointer"
          >
            🛒 PANIER ({getCartItemsCount()})
          </button>

          {/* Bouton Checkout direct requis */}
          {cart.length > 0 && (
            <button
              onClick={sendWhatsAppOrder}
              className="hidden md:inline-block font-mono text-xs tracking-widest border border-emerald-600 bg-emerald-600 text-white px-3 py-1.5 transition uppercase font-black hover:bg-emerald-700 cursor-pointer"
            >
              ⚡ PASSER COMMANDE
            </button>
          )}

          <button
            onClick={() => setIsLightMode(!isLightMode)}
            className={`font-mono text-xs tracking-widest border px-3 py-1.5 transition uppercase ${
              isLightMode
                ? "border-neutral-400 bg-white text-black"
                : "border-neutral-800 bg-black/40 text-white"
            }`}
          >
            {isLightMode ? "🌙 SOMBRE" : "☀️ BLANC"}
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

      {/* SECTION 1 : CARROUSEL IMMERSIF (Supporte Swipe tactile et Flèches) */}
      <section
        className="min-h-screen grid grid-cols-1 lg:grid-cols-12 relative items-center pt-24 lg:pt-0 touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Flèches de navigation d'image Desktop tactiques */}
        <div className="absolute top-1/2 left-4 -translate-y-1/2 z-30 hidden md:block">
          <button
            onClick={handlePrev}
            className="w-12 h-12 rounded-full border border-neutral-700/80 bg-black/50 hover:bg-red-600 hover:border-red-600 text-white flex items-center justify-center text-lg font-black transition active:scale-90 cursor-pointer"
          >
            ‹
          </button>
        </div>
        <div className="absolute top-1/2 right-4 -translate-y-1/2 z-30 hidden md:block">
          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full border border-neutral-700/80 bg-black/50 hover:bg-red-600 hover:border-red-600 text-white flex items-center justify-center text-lg font-black transition active:scale-90 cursor-pointer"
          >
            ›
          </button>
        </div>

        {/* Infos gauche */}
        <div className="lg:col-span-5 px-6 md:px-12 xl:px-20 space-y-6 z-10">
          <div className="space-y-1">
            <span className="font-mono text-xs text-red-600 tracking-widest uppercase font-bold">
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
            <span className="text-2xl font-mono font-black text-red-600">
              {currentProduct.price}.00 $
            </span>
            <button
              onClick={() => addToCart(currentProduct)}
              className={`font-black text-xs uppercase tracking-widest px-6 py-3.5 skew-x-[-8deg] transition shadow-lg cursor-pointer ${
                isLightMode
                  ? "bg-black text-white hover:bg-red-600 hover:text-black"
                  : "bg-white text-black hover:bg-red-600 hover:text-white"
              }`}
            >
              {lang === "FR" ? "AJOUTER AU PANIER" : "ADD TO CART"}
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
          <div
            className={`absolute inset-0 bg-linear-to-t lg:bg-linear-to-r via-transparent to-transparent ${
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
              className={`h-2 transition-all duration-300 cursor-pointer ${
                idx === activeIndex
                  ? "w-12 bg-red-600"
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
                ? "bg-white/80 border-neutral-300 text-red-600"
                : "bg-black/70 border-neutral-800 text-red-500"
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

      {/* 🏁 SECTION COMMANDE FOOTER APRÈS LA VIDÉO (Inspiré de l'esthétique Vercel) */}
      <section
        className={`py-12 border-t text-center px-6 transition-colors ${
          isLightMode
            ? "bg-neutral-100 border-neutral-200"
            : "bg-[#0f0f11] border-neutral-900"
        }`}
      >
        <div className="max-w-md mx-auto space-y-4">
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">
            {lang === "FR"
              ? "Prêt à valider votre sélection ?"
              : "Ready to finalize your gear?"}
          </p>
          <button
            onClick={
              cart.length > 0 ? sendWhatsAppOrder : () => setIsCartOpen(true)
            }
            className="w-full bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase tracking-widest font-black py-4 px-8 shadow-xl transition inline-flex items-center justify-center gap-3 cursor-pointer"
          >
            {cart.length > 0
              ? `🔴 ENVOYER LA COMMANDE (${getCartTotal()}.00 $)`
              : "🛒 OUVRIR LE PANIER POUR COMMANDER"}
          </button>
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
