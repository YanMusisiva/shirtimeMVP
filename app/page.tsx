"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import ClickClientModal from "../components/ClickClientModal";
import ClickCommentModal from "../components/ClickComment";
import SlideUpOnView from "@/components/SlideUpOnView";
import { Listbox } from "@headlessui/react";

type City =
  | "Goma"
  | "Kampala"
  | "Bujumbura"
  | "Nairobi"
  | "Beni"
  | "Mahagi/Ituri";
type Product = { name: string; desc: string; img: string };

const productsByCity: Record<City, Product[]> = {
  Goma: [
    { name: "Product Goma 1", desc: "T-shirts", img: "/goma1.jpg" },
    {
      name: "Product Goma 2",
      desc: "Trainings Nike and shoes",
      img: "/goma2.jpg",
    },
    { name: "Product Goma 3", desc: "T-shirt", img: "/goma3.jpg" },
    { name: "Product Goma 4", desc: "Trainings", img: "/goma4.jpg" },
    { name: "Product Goma 5", desc: "T-shirt", img: "/goma5.jpg" },
    { name: "Product Goma 6", desc: "T-shirt", img: "/goma6.jpg" },
  ],
  Nairobi: [
    { name: "Product Nairobi 1", desc: "necklace", img: "/nairobi1.jpg" },
    { name: "Product Nairobi 2", desc: "handbag", img: "/nairobi2.jpg" },
    { name: "Product Nairobi 3", desc: "bags", img: "/nairobi3.jpg" },
    { name: "Product Nairobi 4", desc: "handbag", img: "/nairobi4.jpg" },
    { name: "Product Nairobi 5", desc: "necklace", img: "/nairobi5.jpg" },
    { name: "Product Nairobi 6", desc: "necklace", img: "/nairobi6.jpg" },
  ],
  Beni: [
    { name: "Product Beni 1", desc: "T-shirt", img: "/beni1.jpg" },
    { name: "Product Beni 2", desc: "Tshirts", img: "/beni2.jpg" },
    { name: "Product Beni 3", desc: "polo", img: "/beni3.jpg" },
    { name: "Product Beni 4", desc: "T-shirt", img: "/beni4.jpg" },
    { name: "Product Beni 5", desc: "T-shirt", img: "/beni5.jpg" },
    { name: "Product Beni 6", desc: "Training", img: "/beni6.jpg" },
  ],
  Kampala: [
    { name: "Product Kampala 1", desc: "Trainings", img: "/kampala1.jpg" },
    { name: "Product Kampala 2", desc: "Trainings Nike", img: "/kampala2.jpg" },
    {
      name: "Product Kampala 3",
      desc: "Trainings Airmax",
      img: "/kampala3.jpg",
    },
    { name: "Product Kampala 4", desc: "T-shirt", img: "/kampala4.jpg" },
    { name: "Product Kampala 5", desc: "T-shirt", img: "/kampala6.jpg" },
    { name: "Product Kampala 6", desc: "T-shirt", img: "/kampala6.jpg" },
  ],
  Bujumbura: [
    {
      name: "Product Bujumbura 1",
      desc: "Trainings Nike",
      img: "/bujumbura1.jpg",
    },
    {
      name: "Product Bujumbura 2",
      desc: "Trainings Nike",
      img: "/bujumbura2.jpg",
    },
    {
      name: "Product Bujumbura 3",
      desc: "Trainings Nike",
      img: "/bujumbura3.jpg",
    },
    { name: "Product Bujumbura 4", desc: "T-shirt", img: "/bujumbura4.jpg" },
    { name: "Product Bujumbura 5", desc: "Shirt", img: "/bujumbura5.jpg" },
    { name: "Product Bujumbura 6", desc: "T-shirt", img: "/bujumbura6.jpg" },
  ],
  "Mahagi/Ituri": [
    { name: "Product Mahagi 1", desc: "'POLO'", img: "/mahagi1.jpg" },
    { name: "Product Mahagi 2", desc: "T-shirt", img: "/mahagi2.jpg" },
    { name: "Product Mahagi 3", desc: "Trainings", img: "/mahagi3.jpg" },
    { name: "Product Mahagi 4", desc: "Trainings Nike", img: "/mahagi4.jpg" },
    { name: "Product Mahagi 5", desc: "T-shirt", img: "/mahagi5.jpg" },
    { name: "Product Mahagi 6", desc: "T-shirt", img: "/mahagi6.jpg" },
  ],
};

const cities = [
  { value: "Goma", label: "🌋 Goma" },
  { value: "Kampala", label: "🌆 Kampala" },
  { value: "Nairobi", label: "🦁 Nairobi" },
  { value: "Bujumbura", label: "🏖️ Bujumbura" },
  { value: "Beni", label: "🏙️ Beni" },
  { value: "Mahagi/Ituri", label: "🌳 Mahagi/Ituri" },
];

export default function Home() {
  const [city, setCity] = useState<City>("Goma");
  const [openClientModal, setOpenClientModal] = useState(false);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const exploreRef = useRef<HTMLDivElement>(null);

  const handleOpenClientModal = (name: string) => {
    setSelectedProductName(name);
    setOpenClientModal(true);
  };
  const handleCloseClientModal = () => {
    setOpenClientModal(false);
    setSelectedProductName("");
  };

  const products = productsByCity[city];
  const images = ["/jesper.jpg", "/dorcas.jpg", "/justine.jpg"];
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [isPaused, images.length]);

  return (
    <main className="bg-[#fafafa] text-neutral-900 min-h-screen font-sans selection:bg-neutral-900 selection:text-white antialiased">
      {/* Navigation / Header Minimaliste */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Logo entreprise"
            width={45}
            height={45}
            className="object-contain filter grayscale tracking-widest"
            priority
          />
          <span className="font-bold text-sm tracking-widest uppercase">
            SHIRTIME
          </span>
        </div>
        <button
          onClick={() => setOpenCommentModal(true)}
          className="text-xs uppercase tracking-widest font-medium border-b border-neutral-900 pb-0.5 hover:text-neutral-500 hover:border-neutral-400 transition"
        >
          Contact
        </button>
      </header>

      {/* Hero Section Style Lookbook */}
      <section className="relative flex flex-col items-center justify-center text-center pt-20 pb-16 px-4 max-w-4xl mx-auto">
        <span className="text-xs uppercase tracking-[0.3em] text-neutral-400 mb-3 block font-semibold">
          Premium E-Shop
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 uppercase text-neutral-900">
          Shirtime Online Shop
        </h1>
        <p className="text-base md:text-lg max-w-xl mb-10 text-neutral-500 font-light leading-relaxed">
          Shop for clothes on Shirtime Online that fit your lifestyle, built
          with contemporary designs and personal taste.
        </p>
        <a
          href="#shop"
          className="bg-neutral-900 text-white text-xs uppercase tracking-widest px-8 py-4 hover:bg-neutral-800 transition-all duration-300 shadow-sm rounded-none"
        >
          Explore Collection
        </a>
      </section>

      {/* Section Diaporama / Servants Style Éditorial */}
      <section className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-t border-b border-neutral-200/60 my-6 bg-white">
        <div className="md:col-span-5 flex flex-col justify-center">
          <span className="text-xs uppercase tracking-widest text-neutral-400 mb-2">
            Our Team
          </span>
          <h3 className="text-2xl font-bold tracking-tight mb-4 text-neutral-900 uppercase">
            Owners &amp; Sellers
          </h3>
          <p className="text-neutral-500 font-light text-sm leading-relaxed mb-4">
            Meet your humble servants, dedicated to finding and bringing you the
            highest quality outfits across cities.
          </p>
        </div>
        <div className="md:col-span-7 flex justify-center md:justify-end">
          <div className="relative w-full max-w-[400px] aspect-[3/4] overflow-hidden bg-neutral-100 group">
            <Image
              src={images[index]}
              alt="Seller's portrait"
              fill
              className="object-cover transition-all duration-700 ease-out scale-100 group-hover:scale-105"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            />
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] uppercase tracking-widest text-neutral-900">
              {index + 1} / {images.length} • Slide
            </div>
          </div>
        </div>
      </section>

      {/* Barre de Filtrage Fixe / Sélecteur Filtré */}
      <section className="sticky top-[77px] z-40 bg-white border-b border-neutral-200 py-4 px-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto mt-12">
        <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">
          Filtering by Territory :
        </span>

        <div className="relative w-64">
          <Listbox value={city} onChange={setCity}>
            <Listbox.Button
              ref={buttonRef}
              className="w-full bg-neutral-50 border border-neutral-200 text-xs uppercase tracking-widest px-4 py-3 font-semibold text-neutral-800 flex items-center justify-between hover:bg-neutral-100 transition focus:outline-none"
            >
              <span>{cities.find((c) => c.value === city)?.label}</span>
              <span className="text-neutral-400 text-[10px]">▼</span>
            </Listbox.Button>
            <Listbox.Options className="absolute mt-1 w-full bg-white border border-neutral-200 shadow-xl z-50 max-h-60 overflow-y-auto focus:outline-none">
              {cities.map((c) => (
                <Listbox.Option
                  key={c.value}
                  value={c.value}
                  className={({ active, selected }) =>
                    `cursor-pointer px-4 py-2.5 text-xs uppercase tracking-widest font-medium transition-colors ${
                      selected
                        ? "bg-neutral-900 text-white"
                        : active
                          ? "bg-neutral-100 text-neutral-900"
                          : "text-neutral-600"
                    }`
                  }
                >
                  {c.label}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
        </div>
      </section>

      {/* Focus Produit Vedette (Highlight) */}
      {products && products.length > 0 && (
        <section
          ref={exploreRef}
          className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <div
            className="relative aspect-[4/3] bg-neutral-100 overflow-hidden cursor-pointer group"
            onClick={() => handleOpenClientModal(products[0].name)}
          >
            <Image
              src={products[0].img}
              alt="Featured Outfit"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute top-4 left-4 bg-neutral-950 text-white text-[10px] uppercase tracking-widest px-2.5 py-1 font-bold">
              Featured Pick
            </div>
          </div>
          <div className="flex flex-col gap-4 max-w-md">
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
              Collection highlight
            </span>
            <h2 className="text-3xl font-black tracking-tight uppercase text-neutral-900">
              {products[0].name}
            </h2>
            <p className="text-neutral-500 font-light text-sm leading-relaxed">
              {products[0].desc}
            </p>
            <button
              className="bg-neutral-900 text-white text-xs uppercase tracking-widest px-6 py-3 font-semibold mt-2 hover:bg-neutral-800 transition w-max"
              onClick={() => handleOpenClientModal(products[0].name)}
            >
              Acquire Item
            </button>
          </div>
        </section>
      )}

      {/* Grille Principale des Collections (Shop) */}
      <section
        id="shop"
        className="py-16 px-4 max-w-7xl mx-auto border-t border-neutral-100 bg-white"
      >
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold block mb-1">
              Catalog
            </span>
            <h2 className="text-3xl font-black uppercase tracking-tight text-neutral-900">
              Explore Contemporary Pieces
            </h2>
          </div>
          <span className="text-xs text-neutral-400 tracking-wider font-mono">
            {products.length} Items Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
          {products.map((product: Product, idx: number) => (
            <SlideUpOnView
              key={idx}
              delay={80 * idx}
              className="group flex flex-col"
            >
              <div
                className="relative w-full aspect-[4/5] bg-neutral-100 overflow-hidden cursor-pointer mb-4"
                onClick={() => handleOpenClientModal(product.name)}
              >
                <Image
                  src={product.img}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-xs uppercase tracking-widest font-bold text-neutral-900 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-neutral-400 uppercase tracking-wider font-light">
                    {product.desc}
                  </p>
                </div>
                <button
                  className="text-[11px] uppercase tracking-widest font-bold border border-neutral-200 px-3 py-1.5 hover:bg-neutral-900 hover:text-white transition"
                  onClick={() => handleOpenClientModal(product.name)}
                >
                  Buy
                </button>
              </div>
            </SlideUpOnView>
          ))}
        </div>
      </section>

      {/* Bouton Prochaine Ville Intuitif */}
      <div className="flex justify-center py-16 bg-neutral-50 border-t border-neutral-200/50">
        <button
          className="group border border-neutral-900 text-neutral-900 text-xs uppercase tracking-widest px-8 py-4 hover:bg-neutral-900 hover:text-white transition-all duration-300 flex items-center gap-3 font-semibold"
          onClick={() => {
            const currentIdx = cities.findIndex((c) => c.value === city);
            const nextIdx = (currentIdx + 1) % cities.length;
            setCity(cities[nextIdx].value as City);
            setTimeout(() => {
              exploreRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
        >
          <span>Next Region :</span>
          <span className="font-light">
            {
              cities[
                (cities.findIndex((c) => c.value === city) + 1) % cities.length
              ].label
            }
          </span>
          <span className="transform group-hover:translate-x-1 transition-transform">
            →
          </span>
        </button>
      </div>

      {/* Call to Action Minimaliste (Footer/Message) */}
      <section className="bg-neutral-950 text-white py-20 px-4 text-center">
        <div className="max-w-xl mx-auto flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-[0.4em] text-neutral-500 mb-4 block font-bold">
            Customer Relations
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight uppercase mb-4">
            We are here to serve you
          </h2>
          <p className="text-neutral-400 font-light text-xs md:text-sm leading-relaxed mb-8">
            For more information about our products or if you have a message to
            convey, please contact us by clicking below.
          </p>
          <button
            className="bg-white text-neutral-950 text-xs uppercase tracking-widest px-8 py-4 font-bold hover:bg-neutral-200 transition"
            onClick={() => setOpenCommentModal(true)}
          >
            Leave a Message
          </button>
        </div>
      </section>

      {/* Modals conditionnels */}
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
