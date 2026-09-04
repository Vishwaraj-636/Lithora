import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../hook/useProduct';
import { useAuth } from '../../auth/hook/useAuth';

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
   return <div className={`${cls} border-[#e5e5e5] border-t-[#000000] rounded-full animate-spin`} />;
};

/* ─── Image Placeholder ─── */
const ImagePlaceholder = ({ small = false }) => (
   <div className={`w-full h-full flex flex-col items-center justify-center bg-[#fafafa] ${small ? 'gap-1' : 'gap-3'}`}>
      <svg width={small ? 18 : 36} height={small ? 18 : 36} viewBox="0 0 24 24" fill="none" stroke="#cccccc" strokeWidth="1.5" strokeLinecap="round">
         <rect x="3" y="3" width="18" height="18" rx="2" />
         <circle cx="8.5" cy="8.5" r="1.5" />
         <polyline points="21 15 16 10 5 21" />
      </svg>
      {!small && <p className="text-[11px] text-[#cccccc]">No image</p>}
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
      handleUpdateProduct,
      handleUpdateProductVariant,
   } = useProduct();
   const { handleLogout } = useAuth();

   /* ── Product state ── */
   const [product, setProduct] = useState(null);
   const [loading, setLoading] = useState(true);
   const [activeImage, setActiveImage] = useState(0);

   /* ── Edit base product state ── */
   const [editMode, setEditMode] = useState(false);
   const [editTitle, setEditTitle] = useState('');
   const [editDescription, setEditDescription] = useState('');
   const [editPrice, setEditPrice] = useState('');
   const [editStock, setEditStock] = useState('');
   const [saving, setSaving] = useState(false);

   /* ── Edit variant state ── */
   const [editingVariantId, setEditingVariantId] = useState(null);
   const [variantEditStock, setVariantEditStock] = useState('');
   const [variantEditPrice, setVariantEditPrice] = useState('');
   const [savingVariant, setSavingVariant] = useState(false);

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
         if (data) {
            const hasOriginalVariant = data.variants?.some(v => v.attributes && v.attributes["Variant"] === "Original");
            if (!hasOriginalVariant) {
               const originalVariant = {
                  _id: data._id + "_original",
                  images: data.images,
                  stock: data.stock || 0,
                  attributes: { "Variant": "Original" },
                  price: data.price
               };
               data.variants = [originalVariant, ...(data.variants || [])];
            }
         }
         setProduct(data);
      } catch (err) {
         console.error('Error fetching product:', err);
      } finally {
         setLoading(false);
      }
   }

   useEffect(() => { fetchProduct(); }, [productId]);

   /* ─── Pre-fill edit state when product loads ─── */
   useEffect(() => {
      if (product) {
         setEditTitle(product.title || '');
         setEditDescription(product.description || '');
         setEditPrice(product.price?.amount ?? '');
         setEditStock(product.stock ?? '');
      }
   }, [product?._id]);

   /* ─── Save base product ─── */
   const handleSaveProduct = async () => {
      setSaving(true);
      try {
         const payload = {};
         if (editTitle !== product.title) payload.title = editTitle;
         if (editDescription !== product.description) payload.description = editDescription;
         if (String(editPrice) !== String(product.price?.amount ?? '')) payload.priceAmount = editPrice;
         if (String(editStock) !== String(product.stock ?? '')) payload.stock = editStock;

         if (Object.keys(payload).length === 0) {
            setEditMode(false);
            return;
         }

         const updated = await handleUpdateProduct(product._id, payload);
         setProduct(prev => ({ ...prev, ...updated }));
         setEditMode(false);
         showToast('Product updated successfully!');
      } catch (err) {
         showToast(err?.response?.data?.message || 'Failed to update product.', 'error');
      } finally {
         setSaving(false);
      }
   };

   /* ─── Start editing a variant ─── */
   const startEditVariant = (variant) => {
      setEditingVariantId(variant._id);
      setVariantEditStock(variant.stock ?? '');
      setVariantEditPrice(variant.price?.amount ?? product.price?.amount ?? '');
   };

   /* ─── Save variant ─── */
   const handleSaveVariant = async (variantId) => {
      setSavingVariant(true);
      try {
         const payload = { stock: variantEditStock, priceAmount: variantEditPrice };
         const updatedVariant = await handleUpdateProductVariant(product._id, variantId, payload);
         setProduct(prev => ({
            ...prev,
            variants: prev.variants.map(v =>
               v._id === variantId ? { ...v, ...updatedVariant } : v
            ),
         }));
         setEditingVariantId(null);
         showToast('Variant updated!');
      } catch (err) {
         showToast(err?.response?.data?.message || 'Failed to update variant.', 'error');
      } finally {
         setSavingVariant(false);
      }
   };

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
         <div className="min-h-screen bg-[#ffffff] flex items-center justify-center" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
            <div className="flex flex-col items-center gap-4">
               <Spinner />
               <p className="text-[13px] text-[#666666] tracking-wide">Loading product…</p>
            </div>
         </div>
      );
   }

   /* ─── Not found ─── */
   if (!product) {
      return (
         <div className="min-h-screen bg-[#ffffff] flex items-center justify-center px-4" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
            <div className="text-center">
               <p className="text-[40px] mb-4">🕵️</p>
               <h2 className="text-[20px] font-semibold text-[#000000]">Product not found</h2>
               <button onClick={() => navigate('/seller/dashboard')} className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#000000] text-white text-[13px] font-semibold hover:bg-[#333333] transition-colors">
                  <ArrowLeftIcon /> Back to Dashboard
               </button>
            </div>
         </div>
      );
   }

   const symbol = CURRENCY_SYMBOLS[product.price?.currency] ?? product.price?.currency ?? '';
   const activeImageUrl = images[activeImage]?.url ?? null;

   return (
      <div className="min-h-screen bg-[#ffffff] text-[#000000] flex flex-col" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>

         {/* ── Toast ── */}
         {toast && (
            <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold shadow-lg border transition-all ${toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-[#000000]/30 text-[#000000]'}`}>
               {toast.type === 'error' ? '✕' : '✓'} {toast.msg}
            </div>
         )}



         {/* ══ Breadcrumb ══ */}
         <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-4 pb-2">
            <p className="text-[11px] tracking-[0.08em] uppercase text-[#666666] font-semibold text-left">
               <span className="hover:text-[#000000] cursor-pointer transition-colors" onClick={() => navigate('/seller/dashboard')}>Dashboard</span>
               <span className="mx-1.5 opacity-50">/</span>
               <span className="text-[#000000] capitalize">{product.title}</span>
            </p>
         </div>

         <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-16 py-6 space-y-8">

            {/* ════════════════════════════════
                SECTION 1 — Product Overview
            ════════════════════════════════ */}
            <section className="bg-white border border-[#e5e5e5] rounded-2xl p-5 sm:p-7" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
               <div className="flex items-center justify-between mb-5">
                  <h2 className="text-[11px] uppercase tracking-widest text-[#999999] font-bold">Product Overview</h2>
                  <div className="flex items-center gap-3">
                     <span className="text-[10px] bg-[#f5f5f5] text-[#999999] px-2.5 py-1 rounded-full font-mono border border-[#e5e5e5] truncate max-w-40 sm:max-w-none">{product._id}</span>
                     {!editMode ? (
                        <button
                           onClick={() => setEditMode(true)}
                           className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e5e5e5] text-[11px] font-semibold text-[#666666] hover:border-[#000000] hover:text-[#000000] transition-all"
                        >
                           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                           Edit
                        </button>
                     ) : (
                        <button
                           onClick={() => setEditMode(false)}
                           className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e5e5e5] text-[11px] font-semibold text-[#666666] hover:border-[#000000] hover:text-[#000000] transition-all"
                        >
                           Cancel
                        </button>
                     )}
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
                  {/* Image gallery */}
                  <div className="flex flex-col-reverse md:flex-row gap-3">
                     {hasMultiple && (
                        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto scrollbar-hide shrink-0 md:max-h-96">
                           {images.map((img, idx) => (
                              <button key={img._id ?? idx} onClick={() => setActiveImage(idx)}
                                 className={`relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${idx === activeImage ? 'border-[#000000] opacity-100' : 'border-[#e5e5e5] opacity-50 hover:opacity-80'}`}>
                                 <img src={img.url} alt="" className="w-full h-full object-cover" />
                              </button>
                           ))}
                        </div>
                     )}
                     <div className="relative w-full h-[350px] md:h-[500px] bg-[#fafafa] border border-[#e5e5e5] rounded-xl overflow-hidden group/slider flex-1">
                        {activeImageUrl ? <img src={activeImageUrl} alt={product.title} className="w-full h-full object-contain" /> : <ImagePlaceholder />}
                        {hasMultiple && (
                           <>
                              <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/70 hover:bg-white/90 text-[#000000] border border-[#e5e5e5] opacity-0 group-hover/slider:opacity-100 transition-all"><ChevronLeftIcon /></button>
                              <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/70 hover:bg-white/90 text-[#000000] border border-[#e5e5e5] opacity-0 group-hover/slider:opacity-100 transition-all"><ChevronRightIcon /></button>
                              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                                 {images.map((_, idx) => (
                                    <button key={idx} onClick={() => setActiveImage(idx)} className={`rounded-full transition-all ${idx === activeImage ? 'w-4 h-1.5 bg-[#000000]' : 'w-1.5 h-1.5 bg-[#000000]/20 hover:bg-[#000000]/40'}`} />
                                 ))}
                              </div>
                           </>
                        )}
                     </div>
                  </div>

                  {/* Product info — view or edit mode */}
                  <div className="flex flex-col gap-4">
                     {editMode ? (
                        /* ── Edit form ── */
                        <div className="flex flex-col gap-4">
                           <div>
                              <label className="text-[11px] uppercase tracking-wider text-[#999999] font-semibold mb-1.5 block">Title</label>
                              <input
                                 type="text"
                                 value={editTitle}
                                 onChange={e => setEditTitle(e.target.value)}
                                 className="w-full h-10 px-3 bg-white border border-[#dddddd] rounded-lg text-[14px] text-[#000000] focus:outline-none focus:border-[#000000] transition-colors"
                              />
                           </div>
                           <div>
                              <label className="text-[11px] uppercase tracking-wider text-[#999999] font-semibold mb-1.5 block">Description</label>
                              <textarea
                                 value={editDescription}
                                 onChange={e => setEditDescription(e.target.value)}
                                 rows={4}
                                 className="w-full px-3 py-2 bg-white border border-[#dddddd] rounded-lg text-[14px] text-[#000000] focus:outline-none focus:border-[#000000] transition-colors resize-none"
                              />
                           </div>
                           <div className="flex gap-3">
                              <div className="flex-1">
                                 <label className="text-[11px] uppercase tracking-wider text-[#999999] font-semibold mb-1.5 block">Price ({product.price?.currency || 'INR'})</label>
                                 <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999] font-semibold text-[13px]">{symbol}</span>
                                    <input
                                       type="number"
                                       min="0"
                                       step="0.01"
                                       value={editPrice}
                                       onChange={e => setEditPrice(e.target.value)}
                                       className="w-full h-10 pl-8 pr-3 bg-white border border-[#dddddd] rounded-lg text-[14px] text-[#000000] focus:outline-none focus:border-[#000000] transition-colors"
                                    />
                                 </div>
                              </div>
                              <div className="flex-1">
                                 <label className="text-[11px] uppercase tracking-wider text-[#999999] font-semibold mb-1.5 block">Base Stock</label>
                                 <input
                                    type="number"
                                    min="0"
                                    value={editStock}
                                    onChange={e => setEditStock(e.target.value)}
                                    className="w-full h-10 px-3 bg-white border border-[#dddddd] rounded-lg text-[14px] text-[#000000] focus:outline-none focus:border-[#000000] transition-colors"
                                 />
                              </div>
                           </div>
                           <button
                              onClick={handleSaveProduct}
                              disabled={saving}
                              className="self-start h-10 px-6 flex items-center gap-2 rounded-xl bg-[#000000] text-white text-[13px] font-bold hover:bg-[#333333] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                           >
                              {saving ? <><Spinner size="sm" /> Saving…</> : <><SaveIcon /> Save Changes</>}
                           </button>
                        </div>
                     ) : (
                        /* ── View mode ── */
                        <>
                           <h1 className="text-[22px] sm:text-[28px] font-semibold text-[#000000] leading-tight capitalize">{product.title}</h1>
                           <div className="flex items-baseline gap-2">
                              <span className="text-[26px] sm:text-[30px] font-bold text-[#000000]">
                                 {symbol}{Number(product.price?.amount ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                              <span className="text-[12px] text-[#999999]">{product.price?.currency}</span>
                           </div>
                           <div className="h-px bg-[#e5e5e5]" />
                           {product.description && (
                              <div>
                                 <p className="text-[10px] uppercase tracking-[0.08em] text-[#999999] font-semibold mb-1.5">Description</p>
                                 <p className="text-[14px] text-[#666666] leading-relaxed">{product.description}</p>
                              </div>
                           )}
                           <div className="h-px bg-[#e5e5e5]" />
                           <div className="flex flex-wrap gap-3 pt-1">
                              <div className="px-4 py-2.5 bg-[#f5f5f5] border border-[#e5e5e5] rounded-xl text-center min-w-22.5">
                                 <p className="text-[10px] text-[#999999] uppercase tracking-widest mb-0.5">Total Stock</p>
                                 <p className="text-[20px] font-semibold text-[#000000]">
                                    {(product.variants ?? []).reduce((acc, v) => acc + (v.stock ?? 0), 0)}
                                 </p>
                              </div>
                              <div className="px-4 py-2.5 bg-[#f5f5f5] border border-[#e5e5e5] rounded-xl text-center min-w-22.5">
                                 <p className="text-[10px] text-[#999999] uppercase tracking-widest mb-0.5">Base Stock</p>
                                 <p className="text-[20px] font-semibold text-[#000000]">{product.stock ?? 0}</p>
                              </div>
                           </div>
                        </>
                     )}
                  </div>
               </div>
            </section>


            {/* ════════════════════════════════
                SECTION 2 — Add New Variant
            ════════════════════════════════ */}
            <section className="bg-white border border-[#e5e5e5] rounded-2xl p-5 sm:p-7" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
               <h2 className="text-[11px] uppercase tracking-widest text-[#999999] font-bold mb-5">Add New Variant</h2>

               <div className="space-y-6">
                  {/* Attribute builder */}
                  <div>
                     <p className="text-[12px] text-[#666666] font-semibold mb-2 uppercase tracking-wider">Attributes</p>
                     <div className="flex flex-col sm:flex-row gap-2">
                        <input type="text" value={attrKey} onChange={e => setAttrKey(e.target.value)} onKeyDown={e => e.key === 'Enter' && addAttribute()}
                           placeholder="Name (e.g. Color, Size)" className="flex-1 h-10 px-3 bg-white border border-[#dddddd] rounded-lg text-[13px] text-[#000000] placeholder:text-[#999999] focus:outline-none focus:border-[#000000] transition-colors" />
                        <input type="text" value={attrVal} onChange={e => setAttrVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && addAttribute()}
                           placeholder="Value (e.g. Red, XL)" className="flex-1 h-10 px-3 bg-white border border-[#dddddd] rounded-lg text-[13px] text-[#000000] placeholder:text-[#999999] focus:outline-none focus:border-[#000000] transition-colors" />
                        <button onClick={addAttribute} className="shrink-0 h-10 px-4 flex items-center gap-1.5 rounded-lg border border-[#000000] text-[#000000] text-[12px] font-semibold hover:bg-[#000000] hover:text-white transition-all">
                           <PlusIcon /> Add
                        </button>
                     </div>
                     {Object.keys(attributes).length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                           {Object.entries(attributes).map(([k, v]) => (
                              <span key={k} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium bg-[#000000]/15 text-[#000000] border border-[#000000]/25">
                                 <span className="text-[#666666] font-normal">{k}:</span> {v}
                                 <button onClick={() => removeAttribute(k)} className="hover:text-[#333333] transition-colors ml-0.5"><XIcon /></button>
                              </span>
                           ))}
                        </div>
                     )}
                  </div>

                  {/* Stock & Price inputs */}
                  <div className="flex flex-col sm:flex-row gap-4">
                     <div className="flex-1">
                        <label className="text-[12px] text-[#666666] font-semibold uppercase tracking-wider mb-2 block">Initial Stock</label>
                        <input type="number" min="0" value={stock} onChange={e => setStock(e.target.value)} placeholder="0"
                           className="w-full h-10 px-3 bg-white border border-[#dddddd] rounded-lg text-[13px] text-[#000000] placeholder:text-[#999999] focus:outline-none focus:border-[#000000] transition-colors" />
                     </div>
                     <div className="flex-1">
                        <label className="text-[12px] text-[#666666] font-semibold uppercase tracking-wider mb-2 block">Price <span className="text-[#999999] font-normal normal-case">(optional)</span></label>
                        <div className="relative">
                           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999] font-semibold">{symbol || '$'}</span>
                           <input type="number" min="0" step="0.01" value={priceAmount} onChange={e => setPriceAmount(e.target.value)} placeholder={product?.price?.amount || '0.00'}
                              className="w-full h-10 pl-8 pr-3 bg-white border border-[#dddddd] rounded-lg text-[13px] text-[#000000] placeholder:text-[#999999] focus:outline-none focus:border-[#000000] transition-colors" />
                        </div>
                     </div>
                  </div>

                  {/* Image upload */}
                  <div>
                     <label className="text-[12px] text-[#666666] font-semibold uppercase tracking-wider mb-2 block">Variant Images <span className="text-[#999999] font-normal normal-case">(optional)</span></label>
                     <div onDrop={handleDrop} onDragOver={e => e.preventDefault()} onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-[#dddddd] rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-[#000000]/50 bg-[#fafafa] transition-colors group">
                        <span className="text-[#cccccc] group-hover:text-[#000000]/60 transition-colors"><UploadIcon /></span>
                        <p className="text-[12px] text-[#999999] group-hover:text-[#666666] transition-colors text-center">
                           Drag &amp; drop images here, or <span className="text-[#000000] underline underline-offset-2">click to browse</span>
                        </p>
                        <p className="text-[10px] text-[#cccccc]">PNG, JPG, WEBP · Max 5 MB each</p>
                     </div>
                     <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={e => handleFiles(e.target.files)} />
                     {variantPreviews.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                           {variantPreviews.map((src, idx) => (
                              <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#e5e5e5] group/prev">
                                 <img src={src} alt="" className="w-full h-full object-cover" />
                                 <button onClick={() => removePreview(idx)} className="absolute inset-0 bg-black/40 opacity-0 group-hover/prev:opacity-100 flex items-center justify-center transition-opacity text-white"><XIcon /></button>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>

                  {createError && <p className="text-[12px] text-red-500">{createError}</p>}

                  <button onClick={handleCreateVariant} disabled={creating}
                     className="w-full sm:w-auto h-11 px-6 flex items-center justify-center gap-2 rounded-xl bg-[#000000] text-white text-[13px] font-bold hover:bg-[#333333] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]">
                     {creating ? <><Spinner size="sm" /> Creating…</> : <><PlusIcon /> Create </>}
                  </button>
               </div>
            </section>

            {/* ════════════════════════════════
                SECTION 3 — Existing Variants
            ════════════════════════════════ */}
            {product.variants && product.variants.length > 0 && (
               <section className="bg-white border border-[#e5e5e5] rounded-2xl p-5 sm:p-7" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                  <h2 className="text-[11px] uppercase tracking-widest text-[#999999] font-bold mb-5">Existing Variants ({product.variants.length})</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {product.variants.map((variant, idx) => {
                        const isEditing = editingVariantId === variant._id;
                        // "Original" synthetic variant has an _id ending in "_original" — no real DB id, skip edit
                        const isOriginalVirtual = variant._id?.endsWith('_original');
                        return (
                           <div key={variant._id || idx} className={`flex flex-col gap-3 p-4 border rounded-xl transition-colors ${isEditing ? 'border-[#000000] bg-white' : 'border-[#e5e5e5] bg-[#fafafa] hover:border-[#000000]/30'}`}>
                              {/* Top row: image + attributes + edit button */}
                              <div className="flex gap-4">
                                 <div className="w-20 h-20 shrink-0 bg-white rounded-lg border border-[#e5e5e5] overflow-hidden">
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
                                             <span key={k} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#e5e5e5] text-[#000000] truncate">
                                                <span className="text-[#666666]">{k}:</span> {v}
                                             </span>
                                          ))
                                       ) : (
                                          <span className="text-[11px] text-[#999999]">No attributes</span>
                                       )}
                                    </div>
                                    {/* Stock and Price display */}
                                    {!isEditing && (
                                       <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#666666]">
                                          <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-[#e5e5e5]">
                                             <span>📦 Stock:</span>
                                             <span className="font-semibold text-[#000000]">{variant.stock ?? 0}</span>
                                          </div>
                                          <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-[#e5e5e5]">
                                             <span>💰 Price:</span>
                                             <span className="font-semibold text-[#000000]">{variant.price?.currency || product.price?.currency || 'INR'} {variant.price?.amount || product.price?.amount || 0}</span>
                                          </div>
                                       </div>
                                    )}
                                 </div>
                                 {/* Edit / Cancel toggle — only for persisted variants */}
                                 {!isOriginalVirtual && (
                                    <button
                                       onClick={() => isEditing ? setEditingVariantId(null) : startEditVariant(variant)}
                                       className="shrink-0 self-start mt-0.5 p-1.5 rounded-lg border border-[#e5e5e5] text-[#999999] hover:border-[#000000] hover:text-[#000000] transition-all"
                                       title={isEditing ? 'Cancel' : 'Edit variant'}
                                    >
                                       {isEditing ? (
                                          <XIcon />
                                       ) : (
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                       )}
                                    </button>
                                 )}
                              </div>

                              {/* Inline edit form */}
                              {isEditing && (
                                 <div className="flex flex-col gap-3 pt-2 border-t border-[#e5e5e5]">
                                    <div className="flex gap-3">
                                       <div className="flex-1">
                                          <label className="text-[10px] uppercase tracking-wider text-[#999999] font-semibold mb-1 block">Stock</label>
                                          <input
                                             type="number"
                                             min="0"
                                             value={variantEditStock}
                                             onChange={e => setVariantEditStock(e.target.value)}
                                             className="w-full h-9 px-3 bg-white border border-[#dddddd] rounded-lg text-[13px] text-[#000000] focus:outline-none focus:border-[#000000] transition-colors"
                                          />
                                       </div>
                                       <div className="flex-1">
                                          <label className="text-[10px] uppercase tracking-wider text-[#999999] font-semibold mb-1 block">Price ({variant.price?.currency || product.price?.currency || 'INR'})</label>
                                          <div className="relative">
                                             <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#999999] text-[12px] font-semibold">{symbol}</span>
                                             <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={variantEditPrice}
                                                onChange={e => setVariantEditPrice(e.target.value)}
                                                className="w-full h-9 pl-7 pr-3 bg-white border border-[#dddddd] rounded-lg text-[13px] text-[#000000] focus:outline-none focus:border-[#000000] transition-colors"
                                             />
                                          </div>
                                       </div>
                                    </div>
                                    <button
                                       onClick={() => handleSaveVariant(variant._id)}
                                       disabled={savingVariant}
                                       className="self-start h-9 px-5 flex items-center gap-1.5 rounded-lg bg-[#000000] text-white text-[12px] font-bold hover:bg-[#333333] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                                    >
                                       {savingVariant ? <><Spinner size="sm" /> Saving…</> : <><SaveIcon /> Save Variant</>}
                                    </button>
                                 </div>
                              )}
                           </div>
                        );
                     })}
                  </div>
               </section>
            )}


         </main>

         {/* ── Footer ── */}
         <footer className="w-full border-t border-[#e5e5e5] py-6 mt-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-2">
               <span className="text-lg tracking-[-0.04em] text-[#000000]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>WEARTH</span>
               <p className="text-[11px] text-[#999999]">© {new Date().getFullYear()} WEARTH. All rights reserved.</p>
            </div>
         </footer>
      </div>
   );
};

export default SellerProductDetail;