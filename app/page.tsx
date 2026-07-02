"use client";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import StoryBar from "@/components/Storybar";
import CollectionCard from "@/components/CollectionCard";
import ProductCollectionView from "@/components/ProductCollectionView";

// 1. Tes vrais types Firestore
type Category = {
  id: string;
  nameFR: string;
  nameEN: string;
};

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
  categoryId?: string; // Seul champ de liaison présent dans ton produit
  likesCount?: number;
  likedBy?: string[];
};

export default function HomePage() {
  // --- ÉTATS GLOBAUX ---
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [lang, setLang] = useState<"FR" | "EN">("FR");
  const [isLightMode, setIsLightMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentUserId = "user_client_visiteur_123";
  const [focusedCategory, setFocusedCategory] = useState<{
    collectionId: string;
    categoryName: string;
    vendorName: string;
    initialProductIndex?: number;
  } | null>(null);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  // --- 🔄 APpELS APIS ---
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [resProducts, resCategories] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
        ]);

        if (resProducts.ok) setProducts(await resProducts.json());
        if (resCategories.ok) setCategories(await resCategories.json());

        const savedCart = localStorage.getItem("shirtime_cart");
        if (savedCart) setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error("Erreur Firestore", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  // --- 📱 STORIES GÉNÉRÉES DEPUIS LES VIDÉOS PRODUITS ---
  const stories = products
    .filter((product) => product.video)
    .map((product) => {
      // Recherche du nom de la catégorie à partir du categoryId du produit
      const assocCat = categories.find((c) => c.id === product.categoryId);
      const catName = assocCat
        ? lang === "FR"
          ? assocCat.nameFR
          : assocCat.nameEN
        : lang === "FR"
          ? product.nameFR
          : product.nameEN;

      return {
        id: product.id,
        videoUrl: product.video,
        vendorId: product.categoryId || "all",
        vendorName: catName,
        collectionName: lang === "FR" ? "Nouveauté" : "New Arrival",
      };
    });

  // --- 📁 CORRESPONDANCE ET REGROUPEMENT PAR CATÉGORIE ---
  const categoriesMap: {
    [key: string]: {
      collectionId: string;
      vendorName: string;
      categoryName: string;
      products: Product[];
    };
  } = {};

  products.forEach((product) => {
    const catId = product.categoryId || "all";

    if (!categoriesMap[catId]) {
      // ⚡ C'est ici qu'on cherche le nom dans la liste des catégories via le categoryId du produit
      const currentCategoryDoc = categories.find((c) => c.id === catId);

      categoriesMap[catId] = {
        collectionId: catId,
        vendorName: "SHIRTIME",
        categoryName: currentCategoryDoc
          ? lang === "FR"
            ? currentCategoryDoc.nameFR
            : currentCategoryDoc.nameEN
          : lang === "FR"
            ? "Collection"
            : "Collection",
        products: [],
      };
    }
    categoriesMap[catId].products.push(product);
  });

  // Tri sécurisé par likes
  const dynamicCollections = Object.values(categoriesMap).sort((a, b) => {
    const maxLikesA = Math.max(...a.products.map((p) => p.likesCount || 0), 0);
    const maxLikesB = Math.max(...b.products.map((p) => p.likesCount || 0), 0);
    return maxLikesB - maxLikesA;
  });

  // --- ACTIONS ---
  const handleAddToBasket = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      let newCart;
      if (existing) {
        newCart = prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item,
        );
      } else {
        newCart = [...prevCart, { ...product, quantity: 1 }];
      }
      localStorage.setItem("shirtime_cart", JSON.stringify(newCart));
      return newCart;
    });

    setIsMiniCartOpen(true);

    // ⚡ Déclenche l'apparition du popup
    setShowCartPopup(true);
    // Optionnel : le refermer automatiquement après 2.5 secondes
    setTimeout(() => setShowCartPopup(false), 2500);
  };

  const sendWhatsAppOrder = () => {
    if (cart.length === 0) return;
    const phone = "243981984788";
    let text =
      lang === "FR"
        ? "🛒 *NOUVELLE COMMANDE SHIRTIME* 🛒\n\n"
        : "🛒 *NEW SHIRTIME ORDER* 🛒\n\n";
    cart.forEach((item) => {
      text += `• ${item.quantity}x ${lang === "FR" ? item.nameFR : item.nameEN} (${item.id}) - ${item.price * item.quantity} $\n`;
    });
    const total = cart.reduce(
      (acc, item) => acc + item.price * (item.quantity || 1),
      0,
    );
    text += `\n💰 *TOTAL : ${total} $*`;
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(text)}`,
      "_blank",
    );
    setCart([]);
    localStorage.removeItem("shirtime_cart");
  };

  const scrollToNextCollection = (currentIndex: number) => {
    const nextCollection = dynamicCollections[currentIndex + 1];
    if (nextCollection) {
      const nextElement = cardRefs.current[nextCollection.collectionId];
      if (nextElement)
        nextElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs uppercase tracking-widest">
        <span className="animate-pulse">
          Génération de la vitrine dynamique...
        </span>
      </div>
    );
  }

  return (
    <main
      className={`min-h-screen transition-colors duration-300 relative pt-24 md:pt-36 ${
        isLightMode ? "bg-[#f5f5f7] text-black" : "bg-black text-white"
      }`}
    >
      <Navbar
        cart={cart}
        setCart={setCart}
        lang={lang}
        setLang={setLang}
        isLightMode={isLightMode}
        setIsLightMode={setIsLightMode}
        sendWhatsAppOrder={sendWhatsAppOrder}
        isMiniCartOpen={isMiniCartOpen} // ⚡ Transmis ici
        setIsMiniCartOpen={setIsMiniCartOpen}
      />

      <StoryBar
        stories={stories}
        lang={lang}
        onOpenCollection={(categoryId, name) =>
          setFocusedCategory({
            collectionId: categoryId,
            categoryName: name,
            vendorName: "SHIRTIME",
          })
        }
      />

      <section className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 justify-center">
          {dynamicCollections.map((col, idx) => (
            <div
              key={col.collectionId}
              ref={(el) => {
                cardRefs.current[col.collectionId] = el;
              }}
              className="scroll-mt-28"
            >
              <CollectionCard
                collectionId={col.collectionId}
                categoryName={col.categoryName}
                vendorName={col.vendorName}
                products={col.products}
                currentUserId={currentUserId}
                lang={lang}
                isLightMode={isLightMode}
                onAddToBasket={handleAddToBasket}
                onReachEnd={() => scrollToNextCollection(idx)}
                onOpen={(productIndex) =>
                  setFocusedCategory({
                    collectionId: col.collectionId,
                    categoryName: col.categoryName,
                    vendorName: col.vendorName,
                    initialProductIndex: productIndex,
                  })
                }
              />
              <div className="w-full max-w-md mx-auto mt-2 text-center">
                <button
                  onClick={() =>
                    setFocusedCategory({
                      collectionId: col.collectionId,
                      categoryName: col.categoryName,
                      vendorName: col.vendorName,
                    })
                  }
                  className="text-[10px] font-mono tracking-widest text-neutral-500 hover:text-white transition uppercase cursor-pointer"
                >
                  {lang === "FR"
                    ? `🔍 Explorer ${col.categoryName}`
                    : `🔍 Explore ${col.categoryName}`}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {focusedCategory && (
        <ProductCollectionView
          vendorId={focusedCategory.collectionId}
          collectionName={focusedCategory.categoryName} // ⚡ Affiche maintenant le vrai nom de la catégorie !
          vendorName={focusedCategory.vendorName}
          initialIndex={focusedCategory.initialProductIndex || 0}
          lang={lang}
          isLightMode={isLightMode}
          onClose={() => setFocusedCategory(null)}
          onAddToBasket={handleAddToBasket}
        />
      )}
      {showCartPopup && (
        <div className="fixed bottom-6 right-6 z-50 bg-red-600 text-white font-mono text-xs uppercase tracking-widest px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-5 duration-300 flex items-center gap-3">
          <span>
            🛒{" "}
            {lang === "FR"
              ? "Article ajouté au panier !"
              : "Item added to cart!"}
          </span>
          <button
            onClick={() => setShowCartPopup(false)}
            className="font-bold hover:text-black"
          >
            ✕
          </button>
        </div>
      )}
    </main>
  );
}
