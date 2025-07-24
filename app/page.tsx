"use client";
import React from "react";
import { useState } from "react";
import Image from "next/image";
import ClickClientModal from "../components/ClickClientModal";
import ClickCommentModal from "../components/ClickComment";
import SlideUpOnView from "@/components/SlideUpOnView";

// Exemple de données produits par ville
type City = "Goma" | "Kampala" | "Bujumbura" | "Mahagi/Ituri";

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

export default function Home() {
  const [city, setCity] = useState<City>("Goma");
  const [openClientModal, setOpenClientModal] = useState(false);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState("");

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
          src="/entreprise.jpg" // Mets l'image dans /public/entreprise.jpg
          alt="Image de l'entreprise"
          width={400}
          height={200}
          className="rounded-2xl shadow-lg h-56 object-fill"
        />
      </section>
      <h3 className="text-xl font-semibold text-center py-4 ">
        Choose your City
      </h3>
      {/* City Selector */}
      <section className="flex justify-center py-4 mb-20">
        <select
          value={city}
          onChange={(e) => setCity(e.target.value as City)} // Type assertion pour éviter l'erreur de type
          className="border rounded-2xl px-4 py-2 text-lg text-black bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-black transition"
        >
          <option value="Goma">Goma</option>
          <option value="Kampala">Kampala</option>
          <option value="Bujumbura">Bujumbura</option>
          <option value="Mahagi/Ituri">Mahagi/Ituri</option>
        </select>
      </section>

      {/* Product Highlight Section */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-12 py-16 px-4 max-w-6xl mx-auto">
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
              <div
                key={idx}
                className="flex flex-col items-center text-center p-4 hover:scale-105 transition border rounded-2xl"
              >
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

      {/* Call to Action Section */}
      <section className="bg-gray-100 py-16 px-4 text-center">
        <h2 className="text-3xl font-medium mb-4">Share your Comments</h2>
        <p className="text-lg text-gray-600 mb-6">
          Please share your comments (FeedBack) - Thank you
        </p>
        <button
          className="bg-black text-white px-6 py-3 rounded-2xl hover:bg-gray-800 transition"
          onClick={handleOpenCommentModal}
        >
          Your Comment
        </button>
        {openCommentModal && (
          <ClickCommentModal onClose={handleCloseCommentModal} />
        )}
      </section>
    </main>
  );
}
