"use client";
import { useState } from "react";
import Image from "next/image";

interface Story {
  id: string;
  videoUrl: string;
  thumbnailUrl?: string;
  vendorId: string;
  vendorName: string;
  collectionName: string;
}

interface StoryBarProps {
  stories: Story[];
  lang: "FR" | "EN";
  onOpenCollection: (vendorId: string, collectionName: string) => void;
}

export default function StoryBar({
  stories,
  lang,
  onOpenCollection,
}: StoryBarProps) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const activeStory = currentIndex !== null ? stories[currentIndex] : null;

  const handleNextStory = () => {
    if (currentIndex !== null && currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevStory = () => {
    if (currentIndex !== null && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="w-full py-4 px-4 md:px-10 overflow-x-auto border-b border-neutral-800/40 scrollbar-none bg-transparent select-none">
      {/* 1. APPARENCE DES MINIATURES (STYLE SHORTS / REELS CARD) */}
      <div className="flex gap-4 items-center">
        {stories.map((story, idx) => (
          <button
            key={story.id}
            onClick={() => setCurrentIndex(idx)}
            className="flex flex-col items-center gap-1.5 focus:outline-none shrink-0 group cursor-pointer"
          >
            {/* Format carte vertical arrondi au lieu du cercle */}
            <div className="w-20 h-28 md:w-24 md:h-36 rounded-2xl p-[2px] bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 transition-transform duration-300 group-hover:scale-105 active:scale-95 shadow-lg">
              <div className="w-full h-full rounded-[14px] bg-neutral-900 relative overflow-hidden flex items-center justify-center">
                {story.thumbnailUrl ? (
                  <Image
                    src={story.thumbnailUrl}
                    alt={story.vendorName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-neutral-400 gap-1">
                    <span className="text-xl">🎥</span>
                    <span className="text-[8px] font-mono tracking-widest uppercase opacity-60">
                      Preview
                    </span>
                  </div>
                )}
                {/* Léger voile sombre inférieur pour détacher le texte si besoin */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            </div>

            {/* Titre / Nom de la catégorie sous la carte */}
            <span className="font-mono text-[9px] md:text-[10px] tracking-wider uppercase text-neutral-400 max-w-[80px] md:max-w-[96px] truncate transition-colors group-hover:text-white text-center">
              {story.vendorName}
            </span>
          </button>
        ))}
      </div>

      {/* 2. LECTEUR DE STORIES AVEC DÉFILEMENT (STYLE WHATSAPP / INSTAGRAM) */}
      {activeStory && currentIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-md animate-in fade-in duration-200">
          {/* Arrière-plan pour fermer au clic extérieur */}
          <div
            className="fixed inset-0 z-0"
            onClick={() => setCurrentIndex(null)}
          />

          {/* Bouton de navigation Précédent (Caché si première story) */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrevStory}
              className="absolute left-4 md:left-10 z-30 bg-white/10 hover:bg-white/20 text-white text-xl w-10 h-10 rounded-full flex items-center justify-center transition cursor-pointer backdrop-blur-sm"
            >
              ◀
            </button>
          )}

          {/* Bouton de navigation Suivant (Caché si dernière story) */}
          {currentIndex < stories.length - 1 && (
            <button
              onClick={handleNextStory}
              className="absolute right-4 md:right-10 z-30 bg-white/10 hover:bg-white/20 text-white text-xl w-10 h-10 rounded-full flex items-center justify-center transition cursor-pointer backdrop-blur-sm"
            >
              ▶
            </button>
          )}

          {/* Conteneur principal du lecteur */}
          <div className="relative w-full max-w-md h-[85vh] mx-4 bg-neutral-950 rounded-3xl overflow-hidden border border-neutral-900 z-10 flex flex-col justify-between p-4 shadow-2xl">
            {/* Indicateurs de progression du haut (Barres horizontales style Instagram) */}
            <div className="absolute top-2 inset-x-4 z-30 flex gap-1">
              {stories.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                    idx === currentIndex
                      ? "bg-white"
                      : idx < currentIndex
                        ? "bg-neutral-500"
                        : "bg-neutral-800"
                  }`}
                />
              ))}
            </div>

            {/* Barre supérieure : Infos catégorie + Bouton fermer */}
            <div className="flex justify-between items-center z-20 pt-2 pb-2 border-b border-white/10">
              <div className="flex flex-col">
                <span className="font-mono font-black text-xs uppercase tracking-widest text-white">
                  {activeStory.vendorName}
                </span>
                <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-wider">
                  {activeStory.collectionName}
                </span>
              </div>
              <button
                onClick={() => setCurrentIndex(null)}
                className="text-white hover:text-red-500 text-sm font-mono p-1 cursor-pointer transition"
              >
                ✕
              </button>
            </div>

            {/* Vidéo plein écran ajustée (Chaque changement d'index recharge la vidéo automatiquement) */}
            <div className="absolute inset-0 z-10 py-14 flex items-center justify-center bg-black">
              <video
                key={activeStory.videoUrl} // Forcer le rechargement du player à chaque slide
                src={activeStory.videoUrl}
                autoPlay
                controls
                loop
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            {/* Barre inférieure : Lien d'accès vers le flux filtré */}
            <div className="z-20 w-full pt-2 flex justify-center">
              <button
                onClick={() => {
                  onOpenCollection(
                    activeStory.vendorId,
                    activeStory.vendorName,
                  );
                  setCurrentIndex(null); // Ferme le lecteur
                }}
                className="w-full font-mono text-xs tracking-widest bg-white text-black font-black py-3 rounded-2xl transition uppercase hover:bg-neutral-200 hover:scale-[1.01] active:scale-95 shadow-xl cursor-pointer text-center"
              >
                {lang === "FR" ? "🛍️ VOIR LA COLLECTION" : "🛍️ VIEW COLLECTION"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
