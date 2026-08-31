import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../hook/useProduct';

/* ── Currency symbol map ── */
const CURRENCY_SYMBOLS = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };

/* ─────────────────────────────────────────
   Icons
───────────────────────────────────────── */
const ArrowLeftIcon = () => (
   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
   </svg>
);
const PlusIcon = () => (
   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
   </svg>
);
const XIcon = () => (
   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
   </svg>
);
const TrashIcon = () => (
   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
   </svg>
);
const SaveIcon = () => (
   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
   </svg>
);
const UploadIcon = () => (
   <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
   </svg>
);
const ChevronLeftIcon = () => (
   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
   </svg>
);
const ChevronRightIcon = () => (
   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
   </svg>
);

/* ─── Spinner ─── */
const Spinner = ({ size = 'md' }) => {
   const cls = size === 'sm' ? 'w-4 h-4 border' : 'w-8 h-8 border-2';
   return <div className={`${cls} border-[#3a322c] border-t-[#b58a5a] rounded-full animate-spin`} />;
};

/* ─── Image Placeholder ─── */
const ImagePlaceholder = ({ small = false }) => (
   <div className={`w-full h-full flex flex-col items-center justify-center bg-[#211f1b] ${small ? 'gap-1' : 'gap-3'}`}>
      <svg width={small ? 18 : 36} height={small ? 18 : 36} viewBox="0 0 24 24" fill="none" stroke="#3a322c" strokeWidth="1.5" strokeLinecap="round">
         <rect x="3" y="3" width="18" height="18" rx="2" />
         <circle cx="8.5" cy="8.5" r="1.5" />
         <polyline points="21 15 16 10 5 21" />
      </svg>
      {!small && <p className="text-[11px] text-[#3a322c]">No image</p>}
   </div>
);

/* ═══════════════════════════════════════════
   SellerProductDetail
═══════════════════════════════════════════ */
const SellerProductDetail = () => {
   const { productId } = useParams();
   const navigate = useNavigate();
   const {
      handleGetProductById,
      handleAddProductVariant,
   } = useProduct();

   /* ── Product state ── */
   const [product, setProduct] = useState(null);
   const [loading, setLoading] = useState(true);
   const [activeImage, setActiveImage] = useState(0);

   /* ── Variant form state ── */
   const [attrKey, setAttrKey] = useState('');
   const [attrVal, setAttrVal] = useState('');
   const [attributes, setAttributes] = useState({});
   const [stock, setStock] = useState('');
   const [priceAmount, setPriceAmount] = useState('');
   const [variantFiles, setVariantFiles] = useState([]);
   const [variantPreviews, setVariantPreviews] = useState([]);
   const [creating, setCreating] = useState(false);
   const [createError, setCreateError] = useState('');
   const fileInputRef = useRef(null);

   /* ── Toast ── */
   const [toast, setToast] = useState(null);

   const showToast = (msg, type = 'success') => {
      setToast({ msg, type });
      setTimeout(() => setToast(null), 3000);
   };

   /* ─── Fetch product ─── */
   async function fetchProduct() {
      try {
         const data = await handleGetProductById(productId);
         setProduct(data);
      } catch (err) {
         console.error('Error fetching product:', err);
      } finally {
         setLoading(false);
      }
   }

   useEffect(() => { fetchProduct(); }, [productId]);

   /* ─── Gallery ─── */
   const images = product?.images ?? [];
   const hasMultiple = images.length > 1;
   const prevImage = () => setActiveImage(i => (i - 1 + images.length) % images.length);
   const nextImage = () => setActiveImage(i => (i + 1) % images.length);

   /* ─── Attribute management ─── */
   const addAttribute = () => {
      const k = attrKey.trim(); const v = attrVal.trim();
      if (!k || !v) return;
      if (Object.keys(attributes).some(key => key.toLowerCase() === k.toLowerCase())) {
         setCreateError(`Attribute "${k}" already added.`); return;
      }
      setAttributes(prev => ({ ...prev, [k]: v }));
      setAttrKey(''); setAttrVal(''); setCreateError('');
   };
   const removeAttribute = (key) => setAttributes(prev => {
      const newAttrs = { ...prev };
      delete newAttrs[key];
      return newAttrs;
   });

   /* ─── File handling ─── */
   const handleFiles = (files) => {
      Array.from(files).forEach(f => {
         setVariantFiles(prev => [...prev, f]);
         const reader = new FileReader();
         reader.onload = (e) => setVariantPreviews(prev => [...prev, e.target.result]);
         reader.readAsDataURL(f);
      });
   };
   const removePreview = (idx) => {
      setVariantFiles(prev => prev.filter((_, i) => i !== idx));
      setVariantPreviews(prev => prev.filter((_, i) => i !== idx));
   };
   const handleDrop = (e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); };

   /* ─── Create variant ─── */
   const handleCreateVariant = async () => {
      if (Object.keys(attributes).length === 0) {
         setCreateError('Add at least one attribute.');
         return;
      }
      setCreateError('');
      setCreating(true);
      try {
         // Create local variant without backend as requested
         const cleanImages = variantPreviews.map((previewUrl, idx) => ({
            url: previewUrl,
            file: variantFiles[idx]
         }));

         const cleanAttributes = { ...attributes };

         const newVariantId = Math.random().toString(36).substring(2, 10);

         const variantPrice = priceAmount
            ? { amount: Number(priceAmount), currency: product.price?.currency || 'INR' }
            : product.price ? { amount: Number(product.price.amount), currency: product.price.currency } : undefined;

         const variantToSave = {
            _id: newVariantId,
            images: cleanImages,
            stock: Number(stock) || 0,
            attributes: cleanAttributes,
            price: variantPrice
         };

         const savedVariant = await handleAddProductVariant(product._id, variantToSave);

         setProduct(prev => ({
            ...prev,
            variants: [...(prev.variants || []), savedVariant]
         }));

         setAttributes({});
         setStock('');
         setPriceAmount('');
         setVariantFiles([]);
         setVariantPreviews([]);
         showToast('Variant created successfully!');
      } catch (err) {
         setCreateError(err?.message || 'Failed to create variant.');
      } finally {
         setCreating(false);
      }
   };


   /* ─── Loading ─── */
   if (loading) {
      return (
         <div className="min-h-screen bg-[#18150f] flex items-center justify-center" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
            <div className="flex flex-col items-center gap-4">
               <Spinner />
               <p className="text-[13px] text-[#a9a49b] tracking-wide">Loading product…</p>
            </div>
         </div>
      );
   }

   /* ─── Not found ─── */
   if (!product) {
      return (
         <div className="min-h-screen bg-[#18150f] flex items-center justify-center px-4" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
            <div className="text-center">
               <p className="text-[40px] mb-4">🕵️</p>
               <h2 className="text-[20px] font-semibold text-[#f2ede6]">Product not found</h2>
               <button onClick={() => navigate('/seller/dashboard')} className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#b58a5a] text-white text-[13px] font-semibold hover:bg-[#c49a68] transition-colors">
                  <ArrowLeftIcon /> Back to Dashboard
               </button>
            </div>
         </div>
      );
   }

   const symbol = CURRENCY_SYMBOLS[product.price?.currency] ?? product.price?.currency ?? '';
   const activeImageUrl = images[activeImage]?.url ?? null;

   return (
      <div className="min-h-screen bg-[#18150f] text-[#f2ede6] flex flex-col" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>

         {/* ── Toast ── */}
         {toast && (
            <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold shadow-lg border transition-all ${toast.type === 'error' ? 'bg-red-900/80 border-red-700 text-red-200' : 'bg-[#231f1b] border-[#b58a5a]/50 text-[#b58a5a]'}`}>
               {toast.type === 'error' ? '✕' : '✓'} {toast.msg}
            </div>
         )}

         {/* ══ Navbar ══ */}
         <nav className="w-full sticky top-0 z-20 bg-[#18150f]/90 backdrop-blur border-b border-[#3a322c]">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 h-14 flex items-center justify-between">
               <span className="text-xl sm:text-2xl tracking-[-0.04em] text-[#f2ede6] cursor-pointer" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }} onClick={() => navigate('/')}>
                  Meera M&amp;G
               </span>
               <button onClick={() => navigate('/seller/dashboard')} className="inline-flex items-center gap-1.5 text-[12px] text-[#a9a49b] hover:text-[#f2ede6] transition-colors">
                  <ArrowLeftIcon /> Dashboard
               </button>
            </div>
         </nav>

         {/* ══ Breadcrumb ══ */}
         <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-4 pb-2">
            <p className="text-[11px] tracking-[0.08em] uppercase text-[#a9a49b] font-semibold text-left">
               <span className="hover:text-[#f2ede6] cursor-pointer transition-colors" onClick={() => navigate('/seller/dashboard')}>Dashboard</span>
               <span className="mx-1.5 opacity-50">/</span>
               <span className="text-[#f2ede6] capitalize">{product.title}</span>
            </p>
         </div>

         <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-16 py-6 space-y-8">

            {/* ════════════════════════════════
                SECTION 1 — Product Overview
            ════════════════════════════════ */}
            <section className="bg-[#211f1b] border border-[#3a322c] rounded-2xl p-5 sm:p-7">
               <div className="flex items-center justify-between mb-5">
                  <h2 className="text-[11px] uppercase tracking-widest text-[#5a5048] font-bold">Product Overview</h2>
                  <span className="text-[10px] bg-[#18150f] text-[#5a5048] px-2.5 py-1 rounded-full font-mono border border-[#3a322c] truncate max-w-40 sm:max-w-none">{product._id}</span>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
                  {/* Image gallery */}
                  <div className="flex flex-col-reverse md:flex-row gap-3">
                     {hasMultiple && (
                        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto scrollbar-hide shrink-0 md:max-h-96">
                           {images.map((img, idx) => (
                              <button key={img._id ?? idx} onClick={() => setActiveImage(idx)}
                                 className={`relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${idx === activeImage ? 'border-[#b58a5a] opacity-100' : 'border-[#3a322c] opacity-50 hover:opacity-80'}`}>
                                 <img src={img.url} alt="" className="w-full h-full object-cover" />
                              </button>
                           ))}
                        </div>
                     )}
                     <div className="relative w-full h-[350px] md:h-[500px] bg-[#18150f] border border-[#3a322c] rounded-xl overflow-hidden group/slider flex-1">
                        {activeImageUrl ? <img src={activeImageUrl} alt={product.title} className="w-full h-full object-contain" /> : <ImagePlaceholder />}
                        {hasMultiple && (
                           <>
                              <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 text-[#f2ede6] border border-white/10 opacity-0 group-hover/slider:opacity-100 hover:bg-[#b58a5a] transition-all"><ChevronLeftIcon /></button>
                              <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 text-[#f2ede6] border border-white/10 opacity-0 group-hover/slider:opacity-100 hover:bg-[#b58a5a] transition-all"><ChevronRightIcon /></button>
                              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                                 {images.map((_, idx) => (
                                    <button key={idx} onClick={() => setActiveImage(idx)} className={`rounded-full transition-all ${idx === activeImage ? 'w-4 h-1.5 bg-[#b58a5a]' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'}`} />
                                 ))}
                              </div>
                           </>
                        )}
                     </div>
                  </div>

                  {/* Product info */}
                  <div className="flex flex-col gap-4">
                     <h1 className="text-[22px] sm:text-[28px] font-semibold text-[#f2ede6] leading-tight capitalize">{product.title}</h1>
                     <div className="flex items-baseline gap-2">
                        <span className="text-[26px] sm:text-[30px] font-bold text-[#b58a5a]">
                           {symbol}{Number(product.price?.amount ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-[12px] text-[#5a5048]">{product.price?.currency}</span>
                     </div>
                     <div className="h-px bg-[#3a322c]" />
                     {product.description && (
                        <div>
                           <p className="text-[10px] uppercase tracking-[0.08em] text-[#5a5048] font-semibold mb-1.5">Description</p>
                           <p className="text-[14px] text-[#a9a49b] leading-relaxed">{product.description}</p>
                        </div>
                     )}
                     <div className="h-px bg-[#3a322c]" />
                     <div className="flex flex-wrap gap-3 pt-1">

                        <div className="px-4 py-2.5 bg-[#18150f] border border-[#3a322c] rounded-xl text-center min-w-22.5">
                           <p className="text-[10px] text-[#5a5048] uppercase tracking-widest mb-0.5">Total Stock</p>
                           <p className="text-[20px] font-semibold text-[#f2ede6]">
                              {(product.variants ?? []).reduce((acc, v) => acc + (v.stock ?? 0), 0)}
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* ════════════════════════════════
                SECTION 2 — Add New Variant
            ════════════════════════════════ */}
            <section className="bg-[#211f1b] border border-[#3a322c] rounded-2xl p-5 sm:p-7">
               <h2 className="text-[11px] uppercase tracking-widest text-[#5a5048] font-bold mb-5">Add New Variant</h2>

               <div className="space-y-6">
                  {/* Attribute builder */}
                  <div>
                     <p className="text-[12px] text-[#a9a49b] font-semibold mb-2 uppercase tracking-wider">Attributes</p>
                     <div className="flex flex-col sm:flex-row gap-2">
                        <input type="text" value={attrKey} onChange={e => setAttrKey(e.target.value)} onKeyDown={e => e.key === 'Enter' && addAttribute()}
                           placeholder="Name (e.g. Color, Size)" className="flex-1 h-10 px-3 bg-[#18150f] border border-[#3a322c] rounded-lg text-[13px] text-[#f2ede6] placeholder-[#5a5048] focus:outline-none focus:border-[#b58a5a] transition-colors" />
                        <input type="text" value={attrVal} onChange={e => setAttrVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && addAttribute()}
                           placeholder="Value (e.g. Red, XL)" className="flex-1 h-10 px-3 bg-[#18150f] border border-[#3a322c] rounded-lg text-[13px] text-[#f2ede6] placeholder-[#5a5048] focus:outline-none focus:border-[#b58a5a] transition-colors" />
                        <button onClick={addAttribute} className="shrink-0 h-10 px-4 flex items-center gap-1.5 rounded-lg border border-[#b58a5a] text-[#b58a5a] text-[12px] font-semibold hover:bg-[#b58a5a] hover:text-[#18150f] transition-all">
                           <PlusIcon /> Add
                        </button>
                     </div>
                     {Object.keys(attributes).length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                           {Object.entries(attributes).map(([k, v]) => (
                              <span key={k} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium bg-[#b58a5a]/15 text-[#b58a5a] border border-[#b58a5a]/25">
                                 <span className="text-[#a9a49b] font-normal">{k}:</span> {v}
                                 <button onClick={() => removeAttribute(k)} className="hover:text-white transition-colors ml-0.5"><XIcon /></button>
                              </span>
                           ))}
                        </div>
                     )}
                  </div>

                  {/* Stock & Price inputs */}
                  <div className="flex flex-col sm:flex-row gap-4">
                     <div className="flex-1">
                        <label className="text-[12px] text-[#a9a49b] font-semibold uppercase tracking-wider mb-2 block">Initial Stock</label>
                        <input type="number" min="0" value={stock} onChange={e => setStock(e.target.value)} placeholder="0"
                           className="w-full h-10 px-3 bg-[#18150f] border border-[#3a322c] rounded-lg text-[13px] text-[#f2ede6] placeholder-[#5a5048] focus:outline-none focus:border-[#b58a5a] transition-colors" />
                     </div>
                     <div className="flex-1">
                        <label className="text-[12px] text-[#a9a49b] font-semibold uppercase tracking-wider mb-2 block">Price <span className="text-[#5a5048] font-normal normal-case">(optional)</span></label>
                        <div className="relative">
                           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5048] font-semibold">{symbol || '$'}</span>
                           <input type="number" min="0" step="0.01" value={priceAmount} onChange={e => setPriceAmount(e.target.value)} placeholder={product?.price?.amount || '0.00'}
                              className="w-full h-10 pl-8 pr-3 bg-[#18150f] border border-[#3a322c] rounded-lg text-[13px] text-[#f2ede6] placeholder-[#5a5048] focus:outline-none focus:border-[#b58a5a] transition-colors" />
                        </div>
                     </div>
                  </div>

                  {/* Image upload */}
                  <div>
                     <label className="text-[12px] text-[#a9a49b] font-semibold uppercase tracking-wider mb-2 block">Variant Images <span className="text-[#5a5048] font-normal normal-case">(optional)</span></label>
                     <div onDrop={handleDrop} onDragOver={e => e.preventDefault()} onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-[#3a322c] rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-[#b58a5a]/50 transition-colors group">
                        <span className="text-[#3a322c] group-hover:text-[#b58a5a]/50 transition-colors"><UploadIcon /></span>
                        <p className="text-[12px] text-[#5a5048] group-hover:text-[#a9a49b] transition-colors text-center">
                           Drag &amp; drop images here, or <span className="text-[#b58a5a] underline underline-offset-2">click to browse</span>
                        </p>
                        <p className="text-[10px] text-[#3a322c]">PNG, JPG, WEBP · Max 5 MB each</p>
                     </div>
                     <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={e => handleFiles(e.target.files)} />
                     {variantPreviews.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                           {variantPreviews.map((src, idx) => (
                              <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#3a322c] group/prev">
                                 <img src={src} alt="" className="w-full h-full object-cover" />
                                 <button onClick={() => removePreview(idx)} className="absolute inset-0 bg-black/60 opacity-0 group-hover/prev:opacity-100 flex items-center justify-center transition-opacity text-white"><XIcon /></button>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>

                  {createError && <p className="text-[12px] text-red-400">{createError}</p>}

                  <button onClick={handleCreateVariant} disabled={creating}
                     className="w-full sm:w-auto h-11 px-6 flex items-center justify-center gap-2 rounded-xl bg-[#b58a5a] text-[#18150f] text-[13px] font-bold hover:bg-[#c49a68] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]">
                     {creating ? <><Spinner size="sm" /> Creating…</> : <><PlusIcon /> Create </>}
                  </button>
               </div>
            </section>

            {/* ════════════════════════════════
                SECTION 3 — Existing Variants
            ════════════════════════════════ */}
            {product.variants && product.variants.length > 0 && (
               <section className="bg-[#211f1b] border border-[#3a322c] rounded-2xl p-5 sm:p-7">
                  <h2 className="text-[11px] uppercase tracking-widest text-[#5a5048] font-bold mb-5">Existing Variants ({product.variants.length})</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {product.variants.map((variant, idx) => (
                        <div key={variant._id || idx} className="flex gap-4 p-4 border border-[#3a322c] rounded-xl bg-[#18150f] hover:border-[#b58a5a]/50 transition-colors">
                           <div className="w-20 h-20 shrink-0 bg-[#211f1b] rounded-lg border border-[#3a322c] overflow-hidden">
                              {variant.images?.[0]?.url ? (
                                 <img src={variant.images[0].url} alt="Variant" className="w-full h-full object-cover" />
                              ) : (
                                 <ImagePlaceholder small />
                              )}
                           </div>
                           <div className="flex flex-col flex-1 justify-center gap-2 min-w-0">
                              {/* Attributes */}
                              <div className="flex flex-wrap gap-1.5">
                                 {Object.entries(variant.attributes || {}).length > 0 ? (
                                    Object.entries(variant.attributes).map(([k, v]) => (
                                       <span key={k} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#3a322c] text-[#f2ede6] truncate">
                                          <span className="text-[#a9a49b]">{k}:</span> {v}
                                       </span>
                                    ))
                                 ) : (
                                    <span className="text-[11px] text-[#5a5048]">No attributes</span>
                                 )}
                              </div>
                              {/* Stock and Price */}
                              <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#a9a49b]">
                                 <div className="flex items-center gap-1.5 bg-[#211f1b] px-2 py-1 rounded-md border border-[#3a322c]">
                                    <span>📦 Stock:</span>
                                    <span className="font-semibold text-[#f2ede6]">{variant.stock ?? 0}</span>
                                 </div>
                                 <div className="flex items-center gap-1.5 bg-[#211f1b] px-2 py-1 rounded-md border border-[#3a322c]">
                                    <span>💰 Price:</span>
                                    <span className="font-semibold text-[#b58a5a]">{variant.price?.currency || product.price?.currency || 'INR'} {variant.price?.amount || product.price?.amount || 0}</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </section>
            )}

         </main>

         {/* ── Footer ── */}
         <footer className="w-full border-t border-[#3a322c] py-6 mt-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-2">
               <span className="text-lg tracking-[-0.04em] text-[#f2ede6]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>Meera M&amp;G</span>
               <p className="text-[11px] text-[#5a5048]">© {new Date().getFullYear()} Meera M&amp;G. All rights reserved.</p>
            </div>
         </footer>
      </div>
   );
};

export default SellerProductDetail;