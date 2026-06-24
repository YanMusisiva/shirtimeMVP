"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import ClickClientModal from "../components/ClickClientModal";

// Structure de traduction
const translations = {
  fr: {
    shopNow: "Acheter maintenant",
    addToCart: "Ajouter au panier",
    added: "Ajouté !",
    contact: "Commander / Message",
    detailsTitle: "Spécifications & Conception",
    cart: "Panier",
    emptyCart: "Votre panier est vide",
    items: "article(s)",
    serveYou: "Nous sommes à votre écoute",
    contactDesc:
      "Pour finaliser votre commande ou pour toute question sur ce produit, envoyez-nous un message direct.",
    featured: "Produit Vedette",
  },
  en: {
    shopNow: "Shop Now",
    addToCart: "Add to Cart",
    added: "Added!",
    contact: "Order / Contact",
    detailsTitle: "Specifications & Design",
    cart: "Cart",
    emptyCart: "Your cart is empty",
    items: "item(s)",
    serveYou: "We are here to serve you",
    contactDesc:
      "To finalize your order or for any inquiries about this product, send us a direct message.",
    featured: "Featured Product",
  },
};

type Product = {
  id: string;
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

// Un seul produit d'exemple (Prêt pour votre future intégration Admin)
const currentProduct: Product = {
  id: "shirtime-01",
  nameEN: "AeroTech Performance Hoodie",
  nameFR: "Sweat à Capuche Performance AeroTech",
  descEN: "Engineered for movement. 100% premium breathable cotton structure.",
  descFR: "Conçu pour le mouvement. Structure 100% coton respirant premium.",
  detailEN:
    "Features reinforced stitching, utility front pockets, and an ergonomic hood. Includes high-stretch fibers that mold perfectly to your body shape.",
  detailFR:
    "Doté de coutures renforcées, de poches avant utilitaires et d'une capuche ergonomique. Fibres ultra-extensibles qui s'adaptent parfaitement à votre morphologie.",
  img: "/goma2.jpg",
  video: "/product-detail.mp4", // Optionnel : Ajoutez votre fichier vidéo dans /public/
  price: "65$",
};

export default function Home() {
  const [lang, setLang] = useState<"fr" | "en">("en");
  const [cart, setCart] = useState<{ id: string; quantity: number }[]>([]);
  const [isAdded, setIsAdded] = useState(false);
  const [openClientModal, setOpenClientModal] = useState(false);
  const [openCommentModal, setOpenCommentModal] = useState(false);

  const t = translations[lang];

  // 1. Détection de la langue du système au chargement
  useEffect(() => {
    const systemLang = navigator.language || (navigator as any).userLanguage;
    if (systemLang && systemLang.startsWith("fr")) {
      setLang("fr");
    } else {
      setLang("en");
    }

    // 2. Récupération du panier depuis le localStorage
    const savedCart = localStorage.getItem("shirtime_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Erreur de lecture du panier", e);
      }
    }
  }, []);

  // 3. Sauvegarde automatique du panier dans le localStorage à chaque modification
  const handleAddToCart = () => {
    let updatedCart = [...cart];
    const existingItem = updatedCart.find(
      (item) => item.id === currentProduct.id,
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      updatedCart.push({ id: currentProduct.id, quantity: 1 });
    }

    setCart(updatedCart);
    localStorage.setItem("shirtime_cart", JSON.stringify(updatedCart));

    // Animation rapide du bouton
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Calcul du nombre total d'articles dans le panier
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <main className="bg-white text-neutral-950 min-h-screen font-sans antialiased selection:bg-neutral-900 selection:text-white">
      {/* Header avec bouton de Langue et Panier */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-100 px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo"
            width={35}
            height={35}
            className="object-contain filter grayscale"
            priority
          />
          <span className="font-black text-xs tracking-widest uppercase">
            SHIRTIME
          </span>
        </div>

        <div className="flex items-center gap-6">
          {/* Sélecteur de langue */}
          <button
            onClick={() => setLang(lang === "en" ? "fr" : "en")}
            className="text-[11px] font-mono tracking-widest uppercase border border-neutral-200 px-2 py-1 rounded hover:bg-neutral-50 transition"
          >
            {lang === "en" ? "FR 🇫🇷" : "EN 🇬🇧"}
          </button>

          {/* Indicateur de Panier LocalStorage */}
          <div className="text-[11px] font-mono tracking-wider text-neutral-500">
            {t.cart}:{" "}
            <span className="font-bold text-neutral-950 bg-neutral-100 px-1.5 py-0.5 rounded">
              {totalItems}
            </span>
          </div>

          <a
            href="#contact"
            className="text-xs uppercase tracking-widest font-bold border-b border-neutral-950 pb-0.5 hover:text-neutral-500 transition"
          >
            {t.contact}
          </a>
        </div>
      </header>

      {/* SECTION PRINCIPALE : L'unique produit vedette (Style Basketball/Immersif) */}
      <section className="min-h-[calc(100vh-70px)] flex flex-col justify-center items-center px-4 max-w-4xl mx-auto py-12">
        <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold mb-2">
          {t.featured}
        </span>
        <h1 className="text-3xl md:text-6xl font-black uppercase tracking-tight text-center mb-6 leading-none">
          {lang === "en" ? currentProduct.nameEN : currentProduct.nameFR}
        </h1>

        {/* Grande Image Centrale du Produit Unique */}
        <div className="relative w-full aspect-[4/5] md:aspect-[16/10] bg-neutral-50 border border-neutral-100 overflow-hidden mb-8 group">
          <Image
            src={currentProduct.img}
            alt={currentProduct.nameEN}
            fill
            sizes="(max-width: 1024px) 100vw, 1200px"
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            priority
          />
          <div className="absolute top-4 right-4 bg-neutral-950 text-white font-mono text-sm px-3 py-1 font-bold">
            {currentProduct.price}
          </div>
        </div>

        {/* Bouton d'action direct avec sauvegarde locale */}
        <div className="flex flex-col items-center gap-3 w-full max-w-md">
          <p className="text-center text-sm text-neutral-500 font-light max-w-sm mb-2">
            {lang === "en" ? currentProduct.descEN : currentProduct.descFR}
          </p>
          <button
            onClick={handleAddToCart}
            className={`w-full text-xs uppercase tracking-widest font-bold py-4 transition-all duration-300 ${
              isAdded
                ? "bg-emerald-600 text-white"
                : "bg-neutral-950 text-white hover:bg-neutral-800"
            }`}
          >
            {isAdded ? `✓ ${t.added}` : t.addToCart}
          </button>
        </div>
      </section>

      {/* SECTION DETAILS & SPECS : Défilement avec support Vidéo/Mouvement */}
      <section className="bg-neutral-50 py-20 px-4 border-t border-neutral-200/60">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Zone Média dynamique : Vidéo ou Image avec effet au scroll */}
          <div className="relative w-full aspect-[4/5] bg-neutral-900 overflow-hidden border border-neutral-200 shadow-sm">
            {currentProduct.video ? (
              <video
                src={currentProduct.video}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={currentProduct.img}
                alt="Product Close-up"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover opacity-90 hover:scale-105 transition-transform duration-700"
              />
            )}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-[9px] text-white tracking-widest uppercase px-2 py-0.5">
              {currentProduct.video ? "Live Details Video" : "Macro View"}
            </div>
          </div>

          {/* Textes explicatifs détaillés */}
          <div className="flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold mb-2">
              Shirtime Lab
            </span>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-4">
              {t.detailsTitle}
            </h2>
            <p className="text-neutral-600 font-light text-sm leading-relaxed border-l-2 border-neutral-900 pl-4 py-1">
              {lang === "en"
                ? currentProduct.detailEN
                : currentProduct.detailFR}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION FINALISATION / CONTACT / COMMENTAIRES */}
      <section
        id="contact"
        className="bg-neutral-950 text-white py-20 px-4 text-center"
      >
        <div className="max-w-xl mx-auto flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-[0.4em] text-neutral-500 mb-4 block font-bold">
            Checkout &amp; Support
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight uppercase mb-4">
            {t.serveYou}
          </h2>
          <p className="text-neutral-400 font-light text-xs md:text-sm leading-relaxed mb-6">
            {t.contactDesc}
          </p>

          {/* Résumé rapide du panier juste avant de contacter */}
          {totalItems > 0 && (
            <div className="mb-6 text-xs font-mono bg-neutral-900 border border-neutral-800 rounded px-4 py-2">
              🛒 {totalItems} {t.items}{" "}
              {lang === "en"
                ? "ready in browser"
                : "prêt(s) dans le navigateur"}
            </div>
          )}

          <button
            className="bg-white text-neutral-950 text-xs uppercase tracking-widest px-8 py-4 font-bold hover:bg-neutral-200 transition w-full sm:w-auto"
            onClick={() => setOpenCommentModal(true)}
          >
            {t.contact}
          </button>
        </div>
      </section>

      {/* Gestion des fenêtres modales */}
      {openClientModal && (
        <ClickClientModal
          nameProduct={
            lang === "en" ? currentProduct.nameEN : currentProduct.nameFR
          }
          onClose={() => setOpenClientModal(false)}
        />
      )}
    </main>
  );
}
