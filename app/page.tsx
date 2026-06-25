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
  const [activeIndex, setActiveIndex] = useState(0);
  const [lang, setLang] = useState<"FR" | "EN">("FR");
  const [isLightMode, setIsLightMode] = useState(false);

  // 🛒 Gestion du Panier & Sidebar
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 🔍 État pour le Modal de Zoom Image
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // 📱 Pour détecter le Swipe sur mobile
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const WHATSAPP_NUMBER = "243981984788";

  // Chargement initial (Pas de loader bloquant l'affichage)
  useEffect(() => {
    const initializeShop = async () => {
      try {
        let freshProducts: Product[] = [];

        // 1. On récupère les produits vivants de la base de données
        const res = await fetch("/api/products");
        if (res.ok) {
          freshProducts = await res.json();
          setProducts(freshProducts);
        }

        // 2. On récupère le panier local
        const savedCart = localStorage.getItem("shirtime_cart");
        if (savedCart && freshProducts.length > 0) {
          const parsedCart = JSON.parse(savedCart);

          if (Array.isArray(parsedCart)) {
            // 🔍 On filtre : l'élément doit être valide ET son produit doit encore exister dans freshProducts
            const validCart = parsedCart.filter((item) => {
              const hasValidStructure = item && item.product && item.product.id;
              if (!hasValidStructure) return false;

              // Vérifie si le produit fait toujours partie du catalogue actif
              const productStillExists = freshProducts.some(
                (p) => p.id === item.product.id,
              );
              return productStillExists;
            });

            // 💾 Mise à jour des états locaux et du localStorage nettoyé
            setCart(validCart);
            if (validCart.length !== parsedCart.length) {
              // S'il y a eu une différence, on enregistre la version nettoyée pour éviter les bugs futurs
              localStorage.setItem("shirtime_cart", JSON.stringify(validCart));
            }
          }
        }
      } catch (err) {
        console.error("Erreur lors de l'initialisation de la boutique", err);
      }
    };

    initializeShop();
  }, []);

  // --- ACTIONS DU PANIER ---
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      let newCart;
      if (existing) {
        newCart = prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        newCart = [...prevCart, { product, quantity: 1 }];
      }
      localStorage.setItem("shirtime_cart", JSON.stringify(newCart));
      return newCart;
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) => {
      const newCart = prevCart
        .map((item) => {
          if (item.product.id === productId) {
            return { ...item, quantity: item.quantity + delta };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
      localStorage.setItem("shirtime_cart", JSON.stringify(newCart));
      return newCart;
    });
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
        ? `🔴 *Je souhaite passer une commande pour les articles suivants*\n\n`
        : `🔴 *I want to place an order for the following items*\n\n`;

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

    // 🧹 NETTOYAGE DU PANIER APRÈS LA COMMANDE
    setCart([]); // Vide l'écran de l'utilisateur instantanément
    localStorage.removeItem("shirtime_cart"); // Supprime du stockage du navigateur
  };

  // --- NAVIGATION DU CARROUSEL ---
  const handlePrev = () => {
    if (products.length === 0) return;
    setActiveIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (products.length === 0) return;
    setActiveIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
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

  const currentProduct = products[activeIndex] || null;

  return (
    <main
      className={`min-h-screen transition-colors duration-500 font-sans relative overflow-x-hidden selection:bg-red-600 ${
        isLightMode ? "bg-[#f5f5f7] text-black" : "bg-[#0b0b0c] text-white"
      }`}
    >
      {/* 🔴 OVERLAY SIDEBAR DU PANIER INTERACTIF */}
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
            {lang === "FR"
              ? `🛒 PANIER (${getCartItemsCount()})`
              : `🛒 CART (${getCartItemsCount()})`}
          </span>
          <button
            onClick={() => setIsCartOpen(false)}
            className="hover:text-red-500 p-2 text-base transition font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Liste du Panier */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 space-y-2 py-20">
              <span className="text-3xl">🕳️</span>
              <p className="uppercase tracking-wider">
                {lang === "FR" ? "Votre panier est vide" : "Your cart is empty"}
              </p>
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
                    alt={
                      lang === "FR" ? item.product.nameFR : item.product.nameEN
                    }
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

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="w-6 h-6 border border-neutral-700 hover:border-red-500 flex items-center justify-center active:scale-95 transition cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="w-6 h-6 border border-neutral-700 hover:border-red-500 flex items-center justify-center active:scale-95 transition cursor-pointer"
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
              {lang === "FR"
                ? "💬 CONFIRMER VIA WHATSAPP"
                : "💬 CONFIRM VIA WHATSAPP"}
            </button>
          </div>
        )}
      </div>

      {/* BARRE DE NAVIGATION */}
      <header className="absolute top-0 left-0 w-full z-40 p-4 md:p-10 flex justify-between items-center mix-blend-difference gap-2">
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

        <div className="flex items-center gap-1 md:gap-2 rounded-sm">
          {/* Bouton Panier */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="font-mono text-xs tracking-widest border border-red-600 bg-red-600 text-white px-2 py-1.5 md:px-3 transition uppercase font-black hover:bg-transparent hover:text-red-500 relative cursor-pointer flex items-center gap-1"
          >
            🛒 <span className="hidden xs:inline">PANIER</span> (
            {getCartItemsCount()})
          </button>

          {/* Bouton Commander Direct */}
          {cart.length > 0 && (
            <button
              onClick={sendWhatsAppOrder}
              className="hidden md:inline-block font-mono text-xs tracking-widest border border-emerald-600 bg-emerald-600 text-white px-3 py-1.5 transition uppercase font-black hover:bg-emerald-700 cursor-pointer"
            >
              {lang === "FR" ? "⚡ PASSER COMMANDE" : "⚡ CHECKOUT NOW"}
            </button>
          )}

          {/* Bouton Light Mode : Émoji seul sur mobile, texte masqué */}
          <button
            onClick={() => setIsLightMode(!isLightMode)}
            className={`font-mono text-xs tracking-widest border px-2.5 py-1.5 md:px-3 transition uppercase cursor-pointer flex items-center gap-1 ${
              isLightMode
                ? "border-neutral-400 bg-white text-black"
                : "border-neutral-800 bg-black/40 text-white"
            }`}
          >
            <span>{isLightMode ? "🌙" : "☀️"}</span>
            <span className="hidden md:inline">
              {isLightMode ? "DARK" : "LIGHT"}
            </span>
          </button>

          {/* Bouton Langue : Icône + Code court ("FR"/"EN") */}
          <button
            onClick={() => setLang(lang === "FR" ? "EN" : "FR")}
            className={`font-mono text-xs tracking-widest border px-2.5 py-1.5 md:px-3 transition uppercase cursor-pointer flex items-center gap-1 ${
              isLightMode
                ? "border-neutral-400 bg-white text-black"
                : "border-neutral-800 bg-black/40 text-white"
            }`}
          >
            <span>🌐</span>
            <span className="text-[10px] md:text-xs">{lang}</span>
          </button>
        </div>
      </header>

      {/* SECTION 1 : CARROUSEL IMMERSIF STYLE BERYL SHOP (IMAGE EN HAUT, TEXTE EN DESSOUS) */}
      {currentProduct ? (
        <section
          className="min-h-screen flex flex-col justify-start relative pt-20 touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Zone Visuelle Principale (Prend la majorité de l'écran en haut) */}
          <div className="w-full h-[55vh] md:h-[65vh] relative group select-none">
            {/* Flèches Tactiques de navigation - Visibles sur Mobile et Desktop */}
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
                    ? "grayscale-0 brightness-95"
                    : "grayscale contrast-125 brightness-90"
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

          {/* Zone d'information et d'actions (Située EN DESSOUS de l'image) */}
          <div className="w-full max-w-4xl mx-auto px-6 md:px-12 py-8 text-center space-y-6 z-10">
            <div className="space-y-2">
              <span className="font-mono text-xs text-red-600 tracking-widest uppercase font-bold block">
                [ {activeIndex + 1} / {products.length} ]
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

            <div className="pt-2">
              <button
                onClick={() => addToCart(currentProduct)}
                className={`font-black text-xs uppercase tracking-widest px-10 py-4 skew-x-[-8deg] transition shadow-lg cursor-pointer ${
                  isLightMode
                    ? "bg-black text-white hover:bg-red-600"
                    : "bg-white text-black hover:bg-red-600 hover:text-white"
                }`}
              >
                {lang === "FR" ? "AJOUTER AU PANIER" : "ADD TO CART"}
              </button>
            </div>

            {/* Points indicateurs horizontaux */}
            <div className="flex justify-center gap-2 pt-4">
              {products.map((p, idx) => (
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
      ) : (
        <div className="min-h-screen bg-[#0b0b0c] text-white flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-red-600 font-black text-xl tracking-wider uppercase mb-2">
            SHIRTIME SHOP
          </h1>
          <p className="text-neutral-500 font-mono text-xs uppercase">
            {lang === "FR"
              ? "Le catalogue est en cours de mise à jour."
              : "The catalog is currently being updated."}
          </p>
        </div>
      )}

      {/* MODAL DE ZOOM ULTRA-HAUTE QUALITÉ (Pinch-to-zoom natif supporté via viewport) */}
      {isZoomOpen && currentProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-md animate-fadeIn"
          onClick={() => setIsZoomOpen(false)}
        >
          {/* Bouton Fermer */}
          <button
            className="absolute top-6 right-6 text-white text-xl font-mono p-4 z-50 bg-black/40 rounded-full border border-neutral-800 hover:text-red-500 cursor-pointer transition"
            onClick={() => setIsZoomOpen(false)}
          >
            ✕
          </button>

          {/* Conteneur Image avec gestion du comportement tactile natif */}
          <div
            className="relative w-full h-full max-w-5xl max-h-[85vh] p-4 flex items-center justify-center overflow-auto touch-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentProduct.img}
              alt="Zoomed Product View"
              className="max-w-full max-h-full object-contain selection:bg-transparent rounded-xs select-none pointer-events-auto brightness-100 contrast-100"
              style={{ transformOrigin: "center center" }}
            />
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] text-neutral-500 uppercase tracking-widest text-center pointer-events-none">
            {lang === "FR"
              ? "📱 Écartez les doigts pour zoomer"
              : "📱 Pinch to zoom artwork"}
          </div>
        </div>
      )}

      {/* SECTION 2 : FOCUS TECHNIQUE & VIDÉO LOOP */}
      {currentProduct && (
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
              • Stream Active
            </div>
          </div>

          {/* Fiche Technique */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block mb-1">
                {lang === "FR"
                  ? "SPECIFICATIONS MATÉRIELLES"
                  : "HARDWARE SPECIFICATIONS"}
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
              {lang === "FR"
                ? currentProduct.detailFR
                : currentProduct.detailEN}
            </p>
          </div>
        </section>
      )}

      {/* 🏁 SECTION COMMANDE FOOTER APRÈS LA VIDÉO */}
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
              ? lang === "FR"
                ? `🔴 ENVOYER LA COMMANDE (${getCartTotal()}.00 $)`
                : `🔴 SEND ORDER NOW (${getCartTotal()}.00 $)`
              : lang === "FR"
                ? "🛒 OUVRIR LE PANIER POUR COMMANDER"
                : "🛒 OPEN CART TO PLACE ORDER"}
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
        © {new Date().getFullYear()} SHIRTIME SHOP.
      </footer>
    </main>
  );
}
