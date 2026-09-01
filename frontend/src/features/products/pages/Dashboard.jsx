import React, { useEffect } from "react";
import { useProduct } from "../hook/useProduct";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hook/useAuth";

/* ── Currency symbol map ── */
const CURRENCY_SYMBOLS = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };

/* ── Heroic "empty box" SVG ── */
const EmptyBoxIcon = () => (
   <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
   >
      <rect
         x="8"
         y="24"
         width="48"
         height="32"
         rx="4"
         stroke="#dddddd"
         strokeWidth="2"
      />
      <path
         d="M8 28l24-16 24 16"
         stroke="#dddddd"
         strokeWidth="2"
         strokeLinejoin="round"
      />
      <path
         d="M22 28l10-7 10 7"
         stroke="#000000"
         strokeWidth="2"
         strokeLinejoin="round"
      />
      <path
         d="M22 36h20"
         stroke="#dddddd"
         strokeWidth="2"
         strokeLinecap="round"
      />
   </svg>
);

/* ── Plus icon ── */
const PlusIcon = () => (
   <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
   >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
   </svg>
);

/* ── Image placeholder ── */
const ImagePlaceholder = () => (
   <div className="w-full h-full flex flex-col items-center justify-center bg-[#f5f5f5]">
      <svg
         width="32"
         height="32"
         viewBox="0 0 24 24"
         fill="none"
         stroke="#cccccc"
         strokeWidth="1.5"
         strokeLinecap="round"
      >
         <rect x="3" y="3" width="18" height="18" rx="2" />
         <circle cx="8.5" cy="8.5" r="1.5" />
         <polyline points="21 15 16 10 5 21" />
      </svg>
      <p className="text-[10px] text-[#cccccc] mt-2">No image</p>
   </div>
);

/* ── Format date ── */
const formatDate = (iso) => {
   if (!iso) return "—";
   return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
   });
};

/* ── Product Card ── */
const ProductCard = ({ product }) => {
   const symbol =
      CURRENCY_SYMBOLS[product.price?.currency] ?? product.price?.currency ?? "";
   const coverUrl = product.images?.[0]?.url ?? null;
   const extraImages = (product.images?.length ?? 0) - 1;
   const navigate = useNavigate();


   return (
      <div
         onClick={() => { navigate(`/seller/product/${product._id}`) }}
         className="bg-white border border-[#e5e5e5] rounded-xl overflow-hidden flex flex-col hover:border-[#000000] transition-colors group"
         style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
      >
         {/* Cover image */}
         <div className="relative h-[250px] sm:h-[300px] w-full overflow-hidden bg-[#fafafa]">
            {coverUrl ? (
               <img
                  src={coverUrl}
                  alt={product.title}
                  className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-300"
               />
            ) : (
               <ImagePlaceholder />
            )}

            {/* Image count badge */}
            {product.images?.length > 0 && (
               <span className="absolute bottom-2 right-2 text-[10px] font-semibold bg-white/80 text-[#666666] border border-[#e5e5e5] rounded px-1.5 py-0.5 backdrop-blur-sm">
                  {product.images.length}{" "}
                  {product.images.length === 1 ? "photo" : "photos"}
               </span>
            )}
         </div>

         {/* Details */}
         <div className="p-4 sm:p-5 flex flex-col gap-2 flex-1">
            <h3 className="text-[15px] font-semibold text-[#000000] leading-snug line-clamp-2">
               {product.title}
            </h3>

            {product.description && (
               <p className="text-[12px] text-[#666666] leading-relaxed line-clamp-2">
                  {product.description}
               </p>
            )}

            <div className="mt-auto pt-3 flex items-center justify-between border-t border-[#f0f0f0]">
               <span className="text-[17px] font-bold text-[#000000]">
                  {symbol}
                  {Number(product.price?.amount ?? 0).toLocaleString("en-IN", {
                     minimumFractionDigits: 2,
                     maximumFractionDigits: 2,
                  })}
               </span>
               <span className="text-[10px] text-[#999999]">
                  {formatDate(product.createdAt)}
               </span>
            </div>
         </div>
      </div>
   );
};

/* ═══════════════════════════════════════════
   Dashboard
═══════════════════════════════════════════ */
const Dashboard = () => {
   const { handleGetProduct } = useProduct();
   const products = useSelector((state) => state.product.sellerProducts);
   const navigate = useNavigate();
   const { handleLogout } = useAuth();

   useEffect(() => {
      handleGetProduct();
   }, []); // [] is important to avoid infinite loop

   const totalProducts = products?.length ?? 0;

   return (
      <div
         className="min-h-screen bg-[#ffffff] text-[#000000] flex flex-col"
         style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
      >
         {/* ── Navbar ── */}
         <nav className="sticky top-0 z-10 bg-[#ffffff]/90 backdrop-blur-md border-b border-[#e5e5e5]">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 h-14 flex items-center justify-between">
               <span
                  className="text-2xl tracking-[-0.04em] text-[#000000]"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
               >
                  Meera M&amp;G
               </span>
               <div className="flex items-center gap-4">
                  <button
                     onClick={handleLogout}
                     className="px-4 py-1.5 rounded-lg bg-[#000000] text-white text-[13px] font-semibold hover:bg-[#333333] transition-colors"
                  >
                     Logout
                  </button>
               </div>
            </div>
         </nav>

         <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-8 sm:py-12">
            {/* ── Page Header ── */}
            <div className="mb-8 sm:mb-10">
               <p className="text-[10px] sm:text-[11px] tracking-[0.08em] uppercase text-[#666666] font-semibold mb-3">
                  Seller
                  <span className="mx-1.5 opacity-50">/</span>
                  <span className="text-[#000000]">Dashboard</span>
               </p>

               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                  <h1 className="text-[24px] sm:text-[28px] lg:text-[32px] font-medium text-[#000000] leading-tight">
                     My Products
                  </h1>
                  <button
                     onClick={() => navigate("/seller/create-product")}
                     className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#000000] text-white text-[13px] sm:text-[14px] font-semibold hover:bg-[#333333] transition-colors active:scale-[0.98] self-start sm:self-auto"
                  >
                     <PlusIcon />
                     Add Slab
                  </button>
               </div>

               <div className="h-px bg-[#e5e5e5] w-full mb-6" />

               {/* Stats row */}
               <div className="flex flex-wrap gap-4 sm:gap-6">
                  <div
                     className="bg-white border border-[#e5e5e5] rounded-xl px-5 py-3.5 flex items-center gap-3"
                     style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.03)' }}
                  >
                     <div className="w-8 h-8 rounded-lg bg-[#f5f5f5] flex items-center justify-center">
                        <svg
                           width="16"
                           height="16"
                           viewBox="0 0 24 24"
                           fill="none"
                           stroke="#000000"
                           strokeWidth="2"
                           strokeLinecap="round"
                        >
                           <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                           <polyline points="16 3 12 7 8 3" />
                        </svg>
                     </div>
                     <div>
                        <p className="text-[10px] text-[#666666] uppercase tracking-wide font-semibold">
                           Total Products
                        </p>
                        <p className="text-[20px] font-bold text-[#000000] leading-none mt-0.5">
                           {totalProducts}
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            {/* ── Product Grid / Empty State ── */}
            {totalProducts === 0 ? (
               /* Empty state */
               <div className="flex flex-col items-center justify-center py-24 text-center">
                  <EmptyBoxIcon />
                  <h2 className="mt-6 text-[18px] font-semibold text-[#000000]">
                     No slabs listed yet
                  </h2>
                  <p className="mt-2 text-[13px] text-[#666666] max-w-xs">
                     You haven't listed any slabs yet. Add your first marble or granite
                     product to start selling.
                  </p>
                  <button
                     onClick={() => navigate("/seller/create-product")}
                     className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#000000] text-white text-[13px] font-semibold hover:bg-[#333333] transition-colors active:scale-[0.98]"
                  >
                     <PlusIcon />
                     List Your First Slab
                  </button>
               </div>
            ) : (
               <div
                  className="grid gap-5"
                  style={{
                     gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  }}
               >
                  {products.map((product) => (
                     <ProductCard key={product._id} product={product} />
                  ))}
               </div>
            )}
         </div>

         {/* ── Footer ── */}
         <footer className="border-t border-[#e5e5e5] py-6 sm:py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
               <span
                  className="text-lg sm:text-xl tracking-[-0.04em] text-[#000000]"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
               >
                  Meera M&amp;G
               </span>
               <p className="text-[10px] sm:text-[11px] text-[#999999]">
                  © {new Date().getFullYear()} Meera M&amp;G. All rights reserved.
               </p>
            </div>
         </footer>
      </div>
   );
};

export default Dashboard;
