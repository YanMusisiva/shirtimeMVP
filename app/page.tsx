"use client";
import React, { useEffect } from "react";
import { useState, useRef } from "react";
import Image from "next/image";
import ClickClientModal from "../components/ClickClientModal";
import ClickCommentModal from "../components/ClickComment";
import SlideUpOnView from "@/components/SlideUpOnView";
import { Listbox } from "@headlessui/react";

// Exemple de données produits par ville
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
    {
      name: "Product Nairobi 2",
      desc: "handbag",
      img: "/nairobi2.jpg",
    },
    { name: "Product Nairobi 3", desc: "bags", img: "/nairobi3.jpg" },
    { name: "Product Nairobi 4", desc: "handbag", img: "/nairobi4.jpg" },
    { name: "Product Nairobi 5", desc: "necklace", img: "/nairobi5.jpg" },
    { name: "Product Nairobi 6", desc: "necklace", img: "/nairobi6.jpg" },
  ],
  Beni: [
    { name: "Product Beni 1", desc: "T-shirt", img: "/beni1.jpg" },
    {
      name: "Product Beni 2",
      desc: "Tshirts",
      img: "/beni2.jpg",
    },
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
    { name: "Product Kampala 5", desc: "T-shirt", img: "/kampala5.jpg" },
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
  { value: "Goma", label: "🌋 Goma" }, // volcan Nyiragongo
  { value: "Kampala", label: "🌆 Kampala" }, // grande ville en pleine expansion
  { value: "Nairobi", label: "🦁 Nairobi" }, // safari / capitale
  { value: "Bujumbura", label: "🏖️ Bujumbura" }, // plages du lac Tanganyika
  { value: "Beni", label: "🏙️ Beni" }, // ville plus petite
  { value: "Mahagi/Ituri", label: "🌳 Mahagi/Ituri" }, // forêt tropicale
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
  const handleOpenCommentModal = () => {
    setOpenCommentModal(true);
  };
  const handleCloseCommentModal = () => {
    setOpenCommentModal(false);
  };
  const products = productsByCity[city as City]; // Type assertion pour éviter l'erreur de type

  const images = ["/john.jpg", "/jesper.jpg", "/dorcas.jpg", "/justine.jpg"];

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPaused, images.length]);

  return (
    <main className="bg-white text-black min-h-screen">
      {/* Logo Section */}
      <header className="flex justify-center py-6">
        <Image
          src="/logo.png" // Mets ton logo dans /public/logo.png
          alt="Logo entreprise"
          width={120}
          height={120}
          className="object-contain"
          priority
        />
      </header>
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-4">
        <h1 className="text-5xl font-semibold mb-4">Shirtime Online Shop</h1>
        <p className="text-lg max-w-xl mb-6 text-gray-600">
          Shop for clothes on Shirtime Online that fit your lifestyle and
          personal taste.
        </p>
        <button className="bg-black text-white px-6 py-3 rounded-2xl hover:bg-gray-800 transition">
          <a href="#shop">Shop Now</a>
        </button>
      </section>

      <h3 className="text-xl font-medium text-center py-4">
        Owners and sellers; your humbles servants
      </h3>
      {/* Company Image Section */}
      <section className="flex  justify-center py-4">
        <Image
          src={images[index]} // Mets l'image dans /public/entreprise.jpg
          alt="Seller's image"
          width={300}
          height={450}
          className="rounded-2xl shadow-lg object-cover transition-all duration-500 cursor-pointer"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        />
      </section>
      <h3 className="text-xl font-semibold text-center py-4 ">
        See products from ▼
      </h3>
      {/* City Selector */}
      <section className="flex justify-center py-4 mb-20">
        <Listbox value={city} onChange={setCity}>
          <Listbox.Button
            ref={buttonRef}
            className="border-2 cursor-pointer border-black rounded-2xl px-6 py-3 text-lg text-black bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-black transition font-semibold w-64 text-left"
          >
            <span className="flex items-center justify-between w-full">
              {cities.find((c) => c.value === city)?.label}
              <span className="ml-2">▼</span>
            </span>
          </Listbox.Button>
          <Listbox.Options className="mt-2 rounded-2xl shadow-lg bg-white border-2 border-black absolute z-10 w-64">
            {cities
              .filter((c) => c.value !== city) // Ne montre pas la ville sélectionnée dans la liste
              .map((c) => (
                <Listbox.Option
                  key={c.value}
                  value={c.value}
                  as="div"
                  className="cursor-pointer px-6 py-3 text-lg text-black font-medium hover:bg-gray-100"
                >
                  {c.label}
                </Listbox.Option>
              ))}
          </Listbox.Options>
        </Listbox>
      </section>

      {/* Product Highlight Section */}
      <section
        ref={exploreRef}
        className="flex flex-col md:flex-row items-center justify-center gap-12 py-16 px-4 max-w-6xl mx-auto"
      >
        <div
          className="w-full md:w-1/2"
          onClick={() => handleOpenClientModal(products[0].name)}
        >
          <Image
            src={products[0].img}
            alt="Product Highlight"
            width={800}
            height={600}
            className="rounded-2xl shadow-xl"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <h2 className="text-3xl font-medium">{products[0].name}</h2>
          <p className="text-gray-600">{products[0].desc}</p>
          <button
            className="bg-black text-white px-5 py-2 rounded-2xl w-max hover:bg-gray-800 transition"
            onClick={() => handleOpenClientModal(products[0].name)}
          >
            Buy
          </button>
        </div>
        {openClientModal && (
          <ClickClientModal
            nameProduct={selectedProductName}
            onClose={handleCloseClientModal}
          />
        )}
      </section>

      {/* Product Grid Showcase */}
      <section id="shop" className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-center text-3xl font-medium mb-12">
          Explore Our Collection
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product: Product, idx: number) => (
            <SlideUpOnView key={idx} delay={100 * idx} className="group">
              <div className="flex flex-col items-center text-center p-4 hover:scale-105 transition border rounded-2xl">
                <div
                  className="relative w-full h-60 mb-4"
                  onClick={() => handleOpenClientModal(product.name)}
                >
                  <Image
                    src={product.img}
                    alt={product.name}
                    fill
                    className="object-cover rounded-2xl"
                  />
                </div>
                <h3 className="text-xl font-medium mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.desc}</p>
                <button
                  className="bg-black text-white px-4 py-2 rounded-2xl hover:bg-gray-800 transition"
                  onClick={() => handleOpenClientModal(product.name)}
                >
                  Buy
                </button>
              </div>
            </SlideUpOnView>
          ))}
          {openClientModal && (
            <ClickClientModal
              nameProduct={selectedProductName}
              onClose={handleCloseClientModal}
            />
          )}
        </div>
      </section>
      {/* Bouton pour changer la ville */}
      <div className="flex justify-center py-8">
        <button
          className="bg-black text-white px-6 py-3 rounded-2xl hover:bg-gray-800 transition font-semibold shadow-lg hover:shadow-blue-400/60 focus:ring-4 focus:ring-blue-300 outline-none border-2 border-transparent hover:border-blue-500 flex items-center gap-2"
          onClick={() => {
            const currentIdx = cities.findIndex((c) => c.value === city);
            const nextIdx = (currentIdx + 1) % cities.length;
            setCity(cities[nextIdx].value as City);
            setTimeout(() => {
              exploreRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
        >
          <span>🛒 ➕</span>
          {
            cities[
              (cities.findIndex((c) => c.value === city) + 1) % cities.length
            ].label
          }
          <span>➡️</span>
        </button>
      </div>

      {/* Call to Action Section */}
      <section className="bg-gray-100 py-16 px-4 text-center">
        <h2 className="text-3xl font-medium mb-4">We are here to serve you</h2>
        <p className="text-lg text-gray-600 mb-6">
          For more information about our products or just have a message to tell
          us , please contact us by sending your message here.
        </p>
        <button
          className="bg-black text-white px-6 py-3 rounded-2xl hover:bg-gray-800 transition"
          onClick={handleOpenCommentModal}
        >
          Your Message
        </button>
        {openCommentModal && (
          <ClickCommentModal onClose={handleCloseCommentModal} />
        )}
      </section>
    </main>
  );
}
