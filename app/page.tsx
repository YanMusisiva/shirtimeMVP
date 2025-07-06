"use client"
import React from "react";
import { useState } from "react";
import Image from "next/image";
import ClickClientModal from "../components/ClickClientModal";

// Exemple de données produits par ville
type City = "Paris" | "Lyon" | "Marseille" | "Lille";

type Product = { name: string; desc: string; img: string };

const productsByCity: Record<City, Product[]> = {
  Paris: [
    { name: "Produit Paris 1", desc: "Description Paris 1", img: "/paris1.jpg" },
    { name: "Produit Paris 2", desc: "Description Paris 2", img: "/paris2.jpg" },
    { name: "Produit Paris 3", desc: "Description Paris 3", img: "/paris3.jpg" },
    { name: "Produit Paris 4", desc: "Description Paris 4", img: "/paris4.jpg" },
    { name: "Produit Paris 5", desc: "Description Paris 5", img: "/paris5.jpg" },
    { name: "Produit Paris 6", desc: "Description Paris 6", img: "/paris6.jpg" },
  ],
  Lyon: [
    { name: "Produit Lyon 1", desc: "Description Lyon 1", img: "/lyon1.jpg" },
    { name: "Produit Lyon 2", desc: "Description Lyon 2", img: "/lyon2.jpg" },
    { name: "Produit Lyon 3", desc: "Description Lyon 3", img: "/lyon3.jpg" },
    { name: "Produit Lyon 4", desc: "Description Lyon 4", img: "/lyon4.jpg" },
    { name: "Produit Lyon 5", desc: "Description Lyon 5", img: "/lyon5.jpg" },
    { name: "Produit Lyon 6", desc: "Description Lyon 6", img: "/lyon6.jpg" },
  ],
  Marseille: [
    { name: "Produit Marseille 1", desc: "Description Marseille 1", img: "/marseille1.jpg" },
    { name: "Produit Marseille 2", desc: "Description Marseille 2", img: "/marseille2.jpg" },
    { name: "Produit Marseille 3", desc: "Description Marseille 3", img: "/marseille3.jpg" },
    { name: "Produit Marseille 4", desc: "Description Marseille 4", img: "/marseille4.jpg" },
    { name: "Produit Marseille 5", desc: "Description Marseille 5", img: "/marseille5.jpg" },
    { name: "Produit Marseille 6", desc: "Description Marseille 6", img: "/marseille6.jpg" },
  ],
  Lille: [
    { name: "Produit Lille 1", desc: "Description Lille 1", img: "/lille1.jpg" },
    { name: "Produit Lille 2", desc: "Description Lille 2", img: "/lille2.jpg" },
    { name: "Produit Lille 3", desc: "Description Lille 3", img: "/lille3.jpg" },
    { name: "Produit Lille 4", desc: "Description Lille 4", img: "/lille4.jpg" },
    { name: "Produit Lille 5", desc: "Description Lille 5", img: "/lille5.jpg" },
    { name: "Produit Lille 6", desc: "Description Lille 6", img: "/lille6.jpg" }, ]}  

export default function Home() {
  const [city, setCity] = useState<City>("Paris");
  const [openModal,setOpenModal]=useState(false);
  const [selectedProductName,setSelectedProductName]=useState("");


    const handleOpenModal=(name:string)=>{
      setSelectedProductName(name)
        setOpenModal(true);
    };
    const handleCloseModal=()=>{
      setOpenModal(false);
      setSelectedProductName("");
    }
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
        <h1 className="text-5xl font-semibold mb-4">Discover Innovation</h1>
        <p className="text-lg max-w-xl mb-6 text-gray-600">
          Experience cutting-edge design and technology seamlessly integrated into your lifestyle.
        </p>
        <button className="bg-black text-white px-6 py-3 rounded-2xl hover:bg-gray-800 transition">
          Shop Now
        </button>
      </section>
      {/* Company Image Section */}
    <section className="flex justify-center py-4">
      <Image
        src="/entreprise.jpg" // Mets l'image dans /public/entreprise.jpg
        alt="Image de l'entreprise"
        width={400}
        height={200}
        className="rounded-2xl shadow-lg object-cover"
      />
    </section>

      {/* City Selector */}
      <section className="flex justify-center py-4 ">
        <select
          value={city}
          onChange={e => setCity(e.target.value as City)} // Type assertion pour éviter l'erreur de type
          className="border rounded-2xl px-4 py-2 text-lg text-black bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-black transition"
        >
          <option value="Paris">Paris</option>
          <option value="Lyon">Lyon</option>
          <option value="Marseille">Marseille</option>
          <option value="Lille">Lille</option>
        </select>
      </section>

      {/* Product Highlight Section */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-12 py-16 px-4 max-w-6xl mx-auto">
        <div className="w-full md:w-1/2" onClick={() => handleOpenModal(products[0].name)}>
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
          <button className="bg-black text-white px-5 py-2 rounded-2xl w-max hover:bg-gray-800 transition" onClick={() => handleOpenModal(products[0].name)}>
            Buy
          </button>
        </div>
        {openModal && (
        <ClickClientModal
          nameProduct={selectedProductName}
          onClose={handleCloseModal}
        />
      )}
      </section>

      {/* Product Grid Showcase */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-center text-3xl font-medium mb-12">Explore Our Collection</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product: Product, idx: number) => (
            <div key={idx} className="flex flex-col items-center text-center p-4 hover:scale-105 transition border rounded-2xl">
              <div className="relative w-full h-60 mb-4" onClick={()=>handleOpenModal(product.name)}>
              <Image
                src={product.img}
                alt={product.name}
                fill
                className="object-cover rounded-2xl"
              />
              </div>
              <h3 className="text-xl font-medium mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-4">{product.desc}</p>
              <button className="bg-black text-white px-4 py-2 rounded-2xl hover:bg-gray-800 transition" onClick={() => handleOpenModal(product.name)}>
              Buy
              </button>
              
            </div>
            
            ))}
            {openModal && (
        <ClickClientModal
          nameProduct={selectedProductName}
          onClose={handleCloseModal}
        />
      )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gray-100 py-16 px-4 text-center">
        <h2 className="text-3xl font-medium mb-4">Join the Future of Innovation</h2>
        <p className="text-lg text-gray-600 mb-6">
          Sign up for exclusive updates and early access to new products.
        </p>
        <button className="bg-black text-white px-6 py-3 rounded-2xl hover:bg-gray-800 transition">
          Sign Up Now
        </button>
      </section>
    </main>
  );
}