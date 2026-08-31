import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useProduct } from "../hook/useProduct";

/* ── Currency symbol map ── */
const CURRENCY_SYMBOLS = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };

/* ── Icons ── */
const ArrowLeftIcon = () => (
   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
   </svg>
);

const ChevronLeftIcon = () => (
   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
   </svg>
);

const ChevronRightIcon = () => (
   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
   </svg>
);

const ShoppingCartIcon = () => (
   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
   </svg>
);

const BoltIcon = () => (
   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
   </svg>
);

const TruckIcon = () => (
   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
   </svg>
);

const ShieldIcon = () => (
   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
   </svg>
);

const RefreshIcon = () => (
   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
   </svg>
);

/* ── Image Placeholder ── */
const ImagePlaceholder = ({ small = false }) => (
   <div className={`w-full h-full flex flex-col items-center justify-center bg-[#211f1b] ${small ? "gap-1" : "gap-3"}`}>
      <svg width={small ? "24" : "48"} height={small ? "24" : "48"} viewBox="0 0 24 24" fill="none" stroke="#3a322c" strokeWidth="1.5" strokeLinecap="round">
         <rect x="3" y="3" width="18" height="18" rx="2" />
         <circle cx="8.5" cy="8.5" r="1.5" />
         <polyline points="21 15 16 10 5 21" />
      </svg>
      {!small && <p className="text-[12px] text-[#3a322c] mt-3">No image available</p>}
   </div>
);

/* ════════════════════════════════════════════
   ProductDetail
════════════════════════════════════════════ */
const ProductDetail = () => {
   const { productId } = useParams();
   const navigate = useNavigate();
   const user = useSelector((state) => state.auth.user);
   const { handleGetProductById } = useProduct();

   const [product, setProduct] = useState(null);
   const [loading, setLoading] = useState(true);
   const [activeImage, setActiveImage] = useState(0);

   /* ── Variant Selection State ── */
   const [selectedAttributes, setSelectedAttributes] = useState({});

   const prevImage = (total) => setActiveImage((i) => (i - 1 + total) % total);
   const nextImage = (total) => setActiveImage((i) => (i + 1) % total);

   async function fetchProductDetails() {
      const data = await handleGetProductById(productId);
      setProduct(data);
      setSelectedAttributes(null);
      setLoading(false);
   }

   useEffect(() => {
      fetchProductDetails();
   }, [productId]);

   /* ── Extract all available attributes and their values ── */
   const availableAttributes = useMemo(() => {
      if (!product || !product.variants) return {};
      const attrs = {};
      product.variants.forEach((variant) => {
         Object.entries(variant.attributes || {}).forEach(([key, val]) => {
            if (!attrs[key]) attrs[key] = new Set();
            attrs[key].add(val);
         });
      });
      // Convert Sets to Arrays
      Object.keys(attrs).forEach((key) => {
         attrs[key] = Array.from(attrs[key]);
      });
      return attrs;
   }, [product]);

   const handleAttributeSelect = (key, val) => {
      let newAttributes = { ...(selectedAttributes || {}), [key]: val };

      let matchingVariants = product.variants.filter(v =>
         Object.entries(newAttributes).every(([k, v_val]) => v.attributes[k] === v_val)
      );

      // If conflicting selection, start fresh from the new attribute
      if (matchingVariants.length === 0) {
         newAttributes = { [key]: val };
         matchingVariants = product.variants.filter(v => v.attributes[key] === val);
      }

      // Auto-select other attributes if there's only 1 option available, or clear if incompatible
      Object.keys(availableAttributes).forEach(attrKey => {
         if (attrKey !== key) {
            const possibleValues = new Set(matchingVariants.map(v => v.attributes[attrKey]));
            if (possibleValues.size === 1) {
               newAttributes[attrKey] = Array.from(possibleValues)[0];
            } else if (!possibleValues.has(newAttributes[attrKey])) {
               delete newAttributes[attrKey];
            }
         }
      });

      setSelectedAttributes(newAttributes);
      setActiveImage(0); // reset image index on variant change
   };

   // Determine the active variant based on selected attributes
   const selectedVariant = useMemo(() => {
      if (!product || !product.variants || !selectedAttributes) return null;
      return product.variants.find((v) => {
         return Object.entries(selectedAttributes).every(
            ([k, val]) => v.attributes[k] === val
         );
      });
   }, [product, selectedAttributes]);

   /* ── Loading state ── */
   if (loading) {
      return (
         <div className="min-h-screen bg-[#18150f] flex items-center justify-center" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
            <div className="flex flex-col items-center gap-4">
               <div className="w-8 h-8 border-2 border-[#3a322c] border-t-[#b58a5a] rounded-full animate-spin" />
               <p className="text-[13px] text-[#a9a49b] tracking-wide">Loading slab details…</p>
            </div>
         </div>
      );
   }

   /* ── Not found state ── */
   if (!product) {
      return (
         <div className="min-h-screen bg-[#18150f] flex items-center justify-center px-4" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
            <div className="text-center">
               <p className="text-[40px] mb-4">🕵️</p>
               <h2 className="text-[20px] font-semibold text-[#f2ede6]">Product not found</h2>
               <p className="mt-2 text-[13px] text-[#a9a49b]">This slab may have been removed or is no longer available.</p>
               <button onClick={() => navigate("/")} className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#b58a5a] text-white text-[13px] font-semibold hover:bg-[#c49a68] transition-colors">
                  <ArrowLeftIcon /> Back to Catalogue
               </button>
            </div>
         </div>
      );
   }

   /* ── Determine display values based on variant or product fallback ── */
   const displayPriceAmount = selectedVariant?.price?.amount ?? product.price?.amount ?? null;
   const displayPriceCurrency = selectedVariant?.price?.currency ?? product.price?.currency ?? "INR";
   const symbol = CURRENCY_SYMBOLS[displayPriceCurrency] ?? displayPriceCurrency;
   const displayImages = (selectedVariant?.images?.length > 0) ? selectedVariant.images : (product.images ?? []);

   const activeImageUrl = displayImages[activeImage]?.url ?? (typeof displayImages[activeImage] === 'string' ? displayImages[activeImage] : null);
   const hasMultiple = displayImages.length > 1;

   return (
      <div className="min-h-screen bg-[#18150f] text-[#f2ede6] flex flex-col" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
         {/* ══════════════════════════════ Navbar ══════════════════════════════ */}
         <nav className="sticky top-0 z-20 bg-[#18150f]/90 backdrop-blur border-b border-[#3a322c]">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 h-14 flex items-center justify-between">
               <span className="text-xl sm:text-2xl tracking-[-0.04em] text-[#f2ede6] cursor-pointer" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }} onClick={() => navigate("/")}>
                  Meera M&amp;G
               </span>
               {!user && (
                  <div className="flex items-center gap-3 sm:gap-4">
                     <a href="/login" className="text-[13px] text-[#a9a49b] hover:text-[#f2ede6] transition-colors">Sign in</a>
                     <a href="/register" className="px-3 sm:px-4 py-1.5 rounded-lg bg-[#b58a5a] text-white text-[12px] sm:text-[13px] font-semibold hover:bg-[#c49a68] transition-colors">Register</a>
                  </div>
               )}
            </div>
         </nav>

         {/* ══════════════════════════════ Breadcrumb ══════════════════════════════ */}
         <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-4 sm:pt-6 pb-2 flex justify-start">
            <p className="text-[10px] sm:text-[11px] tracking-[0.08em] uppercase text-[#a9a49b] font-semibold truncate text-left">
               <span className="hover:text-[#f2ede6] cursor-pointer transition-colors" onClick={() => navigate("/")}>Home</span>
               <span className="mx-1.5 opacity-50">/</span>
               <span className="hover:text-[#f2ede6] cursor-pointer transition-colors hidden sm:inline" onClick={() => navigate("/")}>All Products</span>
               <span className="mx-1.5 opacity-50 hidden sm:inline">/</span>
               <span className="text-[#f2ede6] capitalize">{product.title}</span>
            </p>
         </div>

         {/* ══════════════════════════════ Main Content ══════════════════════════════ */}
         <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-16 py-4 sm:py-8 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-14 xl:gap-20">
               {/* ── LEFT: Image Gallery ── */}
               <div className="flex flex-col-reverse md:flex-row gap-3 sm:gap-4 h-full">
                  {hasMultiple && (
                     <div className="flex md:flex-col gap-2 sm:gap-3 overflow-x-auto md:overflow-y-auto md:overflow-x-hidden pb-1 md:pb-0 md:pr-1 scrollbar-hide shrink-0 md:max-h-125">
                        {displayImages.map((img, idx) => {
                           const imgUrl = img?.url ?? (typeof img === 'string' ? img : null);
                           return (
                              <button
                                 key={img._id ?? idx}
                                 onClick={() => setActiveImage(idx)}
                                 className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all duration-200 ${idx === activeImage ? "border-[#b58a5a] opacity-100 ring-1 ring-[#b58a5a]/30" : "border-[#3a322c] opacity-50 hover:opacity-80 hover:border-[#7a6040]"}`}
                              >
                                 {imgUrl ? (
                                    <img src={imgUrl} alt={`${product.title} view ${idx + 1}`} className="w-full h-full object-cover" />
                                 ) : (
                                    <div className="w-full h-full bg-[#211f1b]" />
                                 )}
                              </button>
                           );
                        })}
                     </div>
                  )}

                  <div className="relative w-full h-[350px] md:h-[500px] bg-[#211f1b] border border-[#3a322c] rounded-xl sm:rounded-2xl overflow-hidden group/slider md:flex-1">
                     {activeImageUrl ? (
                        <img src={activeImageUrl} alt={product.title} className="w-full h-full object-contain transition-opacity duration-300" />
                     ) : (
                        <ImagePlaceholder />
                     )}
                     {hasMultiple && (
                        <>
                           <button onClick={() => prevImage(displayImages.length)} aria-label="Previous image" className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-black/60 text-[#f2ede6] backdrop-blur-sm border border-white/10 opacity-70 sm:opacity-0 sm:group-hover/slider:opacity-100 hover:bg-[#b58a5a] hover:border-[#b58a5a] transition-all duration-200 active:scale-90"><ChevronLeftIcon /></button>
                           <button onClick={() => nextImage(displayImages.length)} aria-label="Next image" className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-black/60 text-[#f2ede6] backdrop-blur-sm border border-white/10 opacity-70 sm:opacity-0 sm:group-hover/slider:opacity-100 hover:bg-[#b58a5a] hover:border-[#b58a5a] transition-all duration-200 active:scale-90"><ChevronRightIcon /></button>
                           <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                              {displayImages.map((_, idx) => (
                                 <button key={idx} onClick={() => setActiveImage(idx)} aria-label={`Go to image ${idx + 1}`} className={`rounded-full transition-all duration-200 ${idx === activeImage ? "w-4 h-1.5 bg-[#b58a5a]" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"}`} />
                              ))}
                           </div>
                        </>
                     )}
                  </div>
               </div>

               {/* ── RIGHT: Product Details ── */}
               <div className="flex flex-col gap-5 sm:gap-6 lg:sticky lg:top-20 lg:self-start">
                  <h1 className="text-[22px] sm:text-[28px] lg:text-[32px] xl:text-[36px] font-semibold text-[#f2ede6] leading-tight tracking-tight capitalize">
                     {product.title}
                  </h1>

                  <div className="flex items-baseline gap-2">
                     {displayPriceAmount !== null ? (
                        <>
                           <span className="text-[28px] sm:text-[32px] lg:text-[36px] font-bold text-[#b58a5a] leading-none">
                              {symbol}{Number(displayPriceAmount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                           </span>
                           <span className="text-[12px] sm:text-[13px] text-[#5a5048]">{displayPriceCurrency}</span>
                        </>
                     ) : (
                        <span className="text-[22px] sm:text-[24px] font-semibold text-[#b58a5a] leading-none">Contact for price</span>
                     )}
                  </div>

                  <div className="h-px bg-[#3a322c] w-full" />

                  {/* Variants List (Grouped by Attribute with Mini Images) */}
                  {product.variants && product.variants.length > 0 && (
                     <div className="flex flex-col gap-5">
                        <p className="text-[13px] sm:text-[14px] text-[#f2ede6] font-semibold">
                           Select Variant
                        </p>

                        <div className="flex flex-col gap-4">
                           {/* Separate Original Product Button */}
                           <div className="mb-2">
                              <p className="text-[14px] sm:text-[15px] text-[#a9a49b] font-medium mb-3">
                                 Default: <span className="text-[#f2ede6] font-bold">{!selectedAttributes ? "Original" : ""}</span>
                              </p>
                              <button
                                 onClick={() => { setSelectedAttributes(null); setActiveImage(0); }}
                                 className={`flex flex-col items-center gap-1.5 p-1.5 rounded-xl border transition-all hover:border-[#b58a5a] ${!selectedAttributes
                                    ? "border-[#b58a5a] bg-[#b58a5a]/10 ring-1 ring-[#b58a5a]/30"
                                    : "border-transparent hover:bg-[#211f1b] hover:border-[#3a322c]"
                                    }`}
                              >
                                 <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border border-[#3a322c] shrink-0 bg-[#18150f]">
                                    {product.images?.[0] ? (
                                       <img src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url} alt="Original Product" className="w-full h-full object-cover" />
                                    ) : (
                                       <ImagePlaceholder small />
                                    )}
                                 </div>
                                 <div className="flex flex-col items-center gap-0.5">
                                    <span className={`text-[11px] sm:text-[12px] font-medium max-w-20 truncate ${!selectedAttributes ? "text-[#b58a5a]" : "text-[#a9a49b]"}`}>
                                       Original
                                    </span>
                                    {product.price?.amount && (
                                       <span className={`text-[10px] sm:text-[11px] font-semibold ${!selectedAttributes ? "text-[#b58a5a]" : "text-[#f2ede6]"}`}>
                                          {CURRENCY_SYMBOLS[product.price?.currency || 'INR'] ?? (product.price?.currency || 'INR')}{Number(product.price.amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                       </span>
                                    )}
                                 </div>
                              </button>
                           </div>

                           {Object.entries(availableAttributes).map(([groupName, values]) => {
                              return (
                                 <div key={groupName} className="mb-4">
                                    <p className="text-[14px] sm:text-[15px] text-[#a9a49b] font-medium mb-3">
                                       {groupName}: <span className="text-[#f2ede6] font-bold">{selectedAttributes?.[groupName] || ""}</span>
                                    </p>
                                    <div className="flex flex-wrap gap-3 sm:gap-4">
                                       {values.map((val) => {
                                          const isSelected = selectedAttributes?.[groupName] === val;

                                          const variantForImg = product.variants.find((v) => v.attributes[groupName] === val);
                                          const vImg = variantForImg?.images?.[0];
                                          const pImg = product.images?.[0];
                                          const imgUrl = vImg?.url ?? (typeof vImg === 'string' ? vImg : null) ?? pImg?.url ?? (typeof pImg === 'string' ? pImg : null);

                                          const priceAmount = variantForImg?.price?.amount;
                                          const priceCurrency = variantForImg?.price?.currency || 'INR';
                                          const sym = CURRENCY_SYMBOLS[priceCurrency] ?? priceCurrency;

                                          return (
                                             <button
                                                key={val}
                                                onClick={() => handleAttributeSelect(groupName, val)}
                                                className={`flex flex-col items-center gap-1.5 p-1.5 rounded-xl border transition-all hover:border-[#b58a5a] ${isSelected
                                                   ? "border-[#b58a5a] bg-[#b58a5a]/10 ring-1 ring-[#b58a5a]/30"
                                                   : "border-transparent hover:bg-[#211f1b] hover:border-[#3a322c]"
                                                   }`}
                                             >
                                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border border-[#3a322c] shrink-0 bg-[#18150f]">
                                                   {imgUrl ? (
                                                      <img src={imgUrl} alt={val} className="w-full h-full object-cover" />
                                                   ) : (
                                                      <ImagePlaceholder small />
                                                   )}
                                                </div>
                                                <div className="flex flex-col items-center gap-0.5">
                                                   <span className={`text-[11px] sm:text-[12px] font-medium max-w-20 truncate ${isSelected ? "text-[#b58a5a]" : "text-[#a9a49b]"}`}>
                                                      {val}
                                                   </span>
                                                   {priceAmount && (
                                                      <span className={`text-[10px] sm:text-[11px] font-semibold ${isSelected ? "text-[#b58a5a]" : "text-[#f2ede6]"}`}>
                                                         {sym}{Number(priceAmount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                      </span>
                                                   )}
                                                </div>
                                             </button>
                                          );
                                       })}
                                    </div>
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  )}

                  {selectedVariant && (
                     <p className="text-[13px] text-[#a9a49b] font-medium">
                        Stock: <span className="text-[#f2ede6]">{selectedVariant.stock}</span> available
                     </p>
                  )}

                  {product.variants && product.variants.length > 0 && <div className="h-px bg-[#3a322c] w-full" />}

                  {product.description && (
                     <div>
                        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-[#5a5048] font-semibold mb-1.5">Description</p>
                        <p className="text-[14px] sm:text-[15px] text-[#a9a49b] leading-relaxed">{product.description}</p>
                     </div>
                  )}

                  <div className="h-px bg-[#3a322c] w-full" />

                  <div className="flex flex-col gap-3">
                     <button disabled={selectedVariant && selectedVariant.stock <= 0} className="w-full h-11 sm:h-12 flex items-center justify-center gap-2 rounded-xl border border-[#b58a5a] text-[#b58a5a] text-[13px] sm:text-[14px] font-semibold tracking-wide hover:bg-[#b58a5a] hover:text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                        <ShoppingCartIcon /> Add to Cart
                     </button>
                     <button disabled={selectedVariant && selectedVariant.stock <= 0} className="w-full h-11 sm:h-12 flex items-center justify-center gap-2 rounded-xl bg-[#b58a5a] text-white text-[13px] sm:text-[14px] font-semibold tracking-wide hover:bg-[#c49a68] transition-all duration-200 active:scale-[0.98] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                        <BoltIcon /> Buy Now
                     </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                     {[
                        { icon: <TruckIcon />, label: "Pan-India Delivery" },
                        { icon: <ShieldIcon />, label: "Secure Payment" },
                        { icon: <RefreshIcon />, label: "Easy Returns" },
                     ].map(({ icon, label }) => (
                        <div key={label} className="flex flex-col items-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-1 sm:px-2 bg-[#211f1b] border border-[#3a322c] rounded-xl text-center">
                           <span className="text-[#b58a5a]">{icon}</span>
                           <span className="text-[9px] sm:text-[10px] text-[#a9a49b] font-medium leading-tight">{label}</span>
                        </div>
                     ))}
                  </div>

                  <div className="pt-1 border-t border-[#2e2a25]">
                     <p className="text-[10px] sm:text-[11px] text-[#5a5048] break-all">
                        Product ID: <span className="text-[#7a6f65]">{product._id}</span>
                     </p>
                  </div>
               </div>
            </div>
         </main>

         {/* ── Back link ── */}
         <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pb-8 sm:pb-10">
            <button onClick={() => navigate("/")} className="inline-flex items-center gap-2 text-[12px] sm:text-[13px] text-[#a9a49b] hover:text-[#f2ede6] transition-colors">
               <ArrowLeftIcon /> Back to Catalogue
            </button>
         </div>

         {/* ── Footer ── */}
         <footer className="border-t border-[#3a322c] py-6 sm:py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
               <span className="text-lg sm:text-xl tracking-[-0.04em] text-[#f2ede6]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>Meera M&amp;G</span>
               <p className="text-[10px] sm:text-[11px] text-[#5a5048]">© {new Date().getFullYear()} Meera M&amp;G. All rights reserved.</p>
            </div>
         </footer>
      </div>
   );
};

export default ProductDetail;
