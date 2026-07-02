"use client";
import { useState } from "react";
import Image from "next/image";

interface NavbarProps {
  cart: any[];
  setCart: React.Dispatch<React.SetStateAction<any[]>>;
  lang: "FR" | "EN";
  setLang: (lang: "FR" | "EN") => void;
  isLightMode: boolean;
  setIsLightMode: (light: boolean) => void;
  isMiniCartOpen: boolean;
  setIsMiniCartOpen: (open: boolean) => void;
  sendWhatsAppOrder: () => void;
}

export default function Navbar({
  cart,
  setCart,
  lang,
  setLang,
  isLightMode,
  setIsLightMode,
  sendWhatsAppOrder,
  isMiniCartOpen,
  setIsMiniCartOpen,
}: NavbarProps) {
  // Compte le nombre total d'articles dans le panier
  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  // Calcule le prix total du panier
  const getCartTotal = () => {
    return cart.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0,
    );
  };

  // Modifier la quantité directement depuis le mini pop-up
  const updateQuantity = (productId: string, action: "plus" | "minus") => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === productId) {
            const currentQty = item.quantity || 1;
            const newQty = action === "plus" ? currentQty + 1 : currentQty - 1;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0),
    );
  };

  return (
    <header className=" w-full p-4 md:p-10 flex justify-between items-center mix-blend-difference gap-2 fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-black/80 border-b border-neutral-900 transition-all">
      {/* 👑 LOGO & MARQUE */}
      <div className="flex items-center gap-3">
        <div className="relative w-8 h-8 bg-white rounded-full p-0.5 animate-[spin_12s_linear_infinite]">
          <Image
            src="/file_0000000037946230a5bbd34766d5b786.png"
            alt="SHIRTIME"
            fill
            className="object-contain rounded-full"
          />
        </div>
        <span className="font-black tracking-widest text-sm uppercase italic text-white">
          SHIRTIME
        </span>
      </div>

      {/* 🎛️ BOUTONS DE NAVIGATION */}
      <div className="flex items-center gap-1 md:gap-2 relative">
        {/* CONTAINER DU BOUTON PANIER + POPUP */}
        <div className="relative">
          <button
            onClick={() => setIsMiniCartOpen(!isMiniCartOpen)}
            className="font-mono text-xs tracking-widest border border-red-600 bg-red-600 text-white px-2 py-1.5 md:px-3 transition uppercase font-black hover:bg-transparent hover:text-red-500 relative cursor-pointer flex items-center gap-1 rounded-2xl"
          >
            🛒 <span className="hidden xs:inline">PANIER</span> (
            {getCartItemsCount()})
          </button>

          {/* 🛒 🆕 MINI POP-UP DE CONFIRMATION / PANIER (Style rounded-2xl) */}
          {isMiniCartOpen && (
            <>
              {/* Overlay invisible pour fermer le pop-up en cliquant à côté */}
              <div
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setIsMiniCartOpen(false)}
              />

              <div className="absolute right-0 top-10 w-72 md:w-80 bg-black/95 border border-neutral-800 p-4 text-white z-50 rounded-2xl shadow-2xl backdrop-blur-md font-mono text-xs animate-in fade-in slide-in-from-top-2 duration-200">
                <h3 className="font-bold tracking-wider mb-3 text-red-500 uppercase">
                  {lang === "FR" ? "Votre commande" : "Your order"}
                </h3>

                {cart.length === 0 ? (
                  <p className="text-neutral-400 py-4 text-center">
                    {lang === "FR" ? "Le panier est vide." : "Cart is empty."}
                  </p>
                ) : (
                  <>
                    {/* Liste des produits dans le pop-up */}
                    <div className="max-h-48 overflow-y-auto flex flex-col gap-3 pr-1 border-b border-neutral-800 pb-3 mb-3">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-2"
                        >
                          <div className="flex flex-col">
                            <span className="font-bold truncate max-w-[140px]">
                              {lang === "FR" ? item.nameFR : item.nameEN}
                            </span>
                            <span className="text-neutral-400 text-[10px]">
                              {item.price} $
                            </span>
                          </div>

                          {/* Contrôles de quantité + / - */}
                          <div className="flex items-center gap-2 border border-neutral-800 rounded-2xl px-2 py-0.5 bg-neutral-900">
                            <button
                              onClick={() => updateQuantity(item.id, "minus")}
                              className="text-neutral-400 hover:text-white px-1 text-sm font-bold cursor-pointer"
                            >
                              -
                            </button>
                            <span className="text-white font-bold">
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, "plus")}
                              className="text-neutral-400 hover:text-white px-1 text-sm font-bold cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total et Bouton de validation */}
                    <div className="flex justify-between items-center mb-4 font-bold">
                      <span>TOTAL:</span>
                      <span className="text-red-500 text-sm">
                        {getCartTotal()} $
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        sendWhatsAppOrder();
                        setIsMiniCartOpen(false);
                      }}
                      className="w-full font-mono text-xs tracking-widest bg-emerald-600 border border-emerald-600 text-white py-2.5 rounded-2xl transition uppercase font-black hover:bg-emerald-700 cursor-pointer text-center block"
                    >
                      {lang === "FR"
                        ? "⚡ CONFIRMER LA COMMANDE"
                        : "⚡ CONFIRM ORDER"}
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* 🌙 / ☀️ BOUTON THÈME */}
        <button
          onClick={() => setIsLightMode(!isLightMode)}
          className={`rounded-2xl font-mono text-xs tracking-widest border px-2.5 py-1.5 md:px-3 transition uppercase cursor-pointer flex items-center gap-1 ${
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

        {/* 🌐 BOUTON LANGUE */}
        <button
          onClick={() => setLang(lang === "FR" ? "EN" : "FR")}
          className={`rounded-2xl font-mono text-xs tracking-widest border px-2.5 py-1.5 md:px-3 transition uppercase cursor-pointer flex items-center gap-1 ${
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
  );
}
