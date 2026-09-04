import React, { useState, useRef } from "react";
import { useProduct } from "../hook/useProduct";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hook/useAuth";

const MAX_IMAGES = 7;
const MAX_CHARS = 1000;

/* ── Chevron SVG ── */
const ChevronDown = () => (
   <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
   >
      <polyline points="6 9 12 15 18 9" />
   </svg>
);

/* ── Upload Cloud SVG ── */
const UploadIcon = () => (
   <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
   >
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
   </svg>
);

/* ── Reusable label + input wrapper ── */
const Field = ({ label, htmlFor, children }) => (
   <div className="flex flex-col gap-1.5">
      <label
         htmlFor={htmlFor}
         className="text-[13px] font-semibold text-[#000000]"
      >
         {label}
      </label>
      {children}
   </div>
);

/* ── Shared input class ── */
const inputCls =
   "w-full bg-white border border-[#dddddd] rounded-lg px-3.5 py-2.5 text-[14px] sm:text-[15px] text-[#000000] placeholder:text-[#999999] focus:outline-none focus:border-[#000000] focus:ring-1 focus:ring-[#000000] transition-colors";

/* ── Section heading ── */
const SectionHeading = ({ children }) => (
   <h2 className="text-[10px] sm:text-[11px] tracking-[0.08em] uppercase font-semibold text-[#666666] mb-4 sm:mb-5">
      {children}
   </h2>
);

/* ═══════════════════════════════════════════════
   CreateProduct
═══════════════════════════════════════════════ */
const CreateProduct = () => {
   const { handleCreateProduct } = useProduct();
   const { handleLogout } = useAuth();

   const [formData, setFormData] = useState({
      title: "",
      description: "",
      priceAmount: "",
      priceCurrency: "INR",
      stock: "",
   });
   const [images, setImages] = useState([]); // { file, preview }[]
   const [dragOver, setDragOver] = useState(false);
   const fileInputRef = useRef(null);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const navigate = useNavigate();
   /* ─── handlers ─── */
   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((p) => ({ ...p, [name]: value }));
   };

   const addFiles = (files) => {
      const slots = MAX_IMAGES - images.length;
      const next = Array.from(files)
         .slice(0, slots)
         .map((f) => ({ file: f, preview: URL.createObjectURL(f) }));
      setImages((p) => [...p, ...next]);
   };

   const removeImage = (idx) =>
      setImages((p) => {
         URL.revokeObjectURL(p[idx].preview);
         return p.filter((_, i) => i !== idx);
      });

   const handleDrop = (e) => {
      e.preventDefault();
      setDragOver(false);
      addFiles(e.dataTransfer.files);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
         const data = new FormData();
         data.append("title", formData.title);
         data.append("description", formData.description);
         data.append("priceAmount", formData.priceAmount);
         data.append("priceCurrency", formData.priceCurrency);
         data.append("stock", formData.stock);
         images.forEach((img) => data.append("images", img.file));
         await handleCreateProduct(data);
         navigate("/seller/dashboard");
      } catch (err) {
         console.error(err);
      } finally {
         setIsSubmitting(false);
      }
   };

   /* ─── render ─── */
   return (
      <div
         className="min-h-screen bg-[#ffffff] text-[#000000]"
         style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
      >


         <div className="w-full max-w-300 mx-auto px-4 sm:px-8 lg:px-16 py-8 sm:py-12">
            {/* ── Page Header ── */}
            <div className="mb-8 sm:mb-10">
               <p className="text-[10px] sm:text-[11px] tracking-[0.08em] uppercase text-[#666666] font-semibold mb-3">
                  Products
                  <span className="mx-1.5 opacity-50">/</span>
                  <span className="text-[#000000]">Create New Product</span>
               </p>
               <h1 className="text-[24px] sm:text-[28px] lg:text-[32px] font-medium text-[#000000] leading-tight mb-5 sm:mb-6">
                  Create New Product
               </h1>
               <div className="h-px bg-[#e5e5e5] w-full" />
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleSubmit}>
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
                  {/* ══ LEFT COLUMN ══════════════════════════════════════════ */}
                  <div className="lg:col-span-5 flex flex-col gap-5">
                     {/* Card 1 — Basic Information */}
                     <div className="bg-white border border-[#e5e5e5] rounded-xl p-5 sm:p-7" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.03)" }}>
                        <SectionHeading>Basic Information</SectionHeading>
                        <div className="flex flex-col gap-5">
                           <Field label="Product Title" htmlFor="title">
                              <input
                                 id="title"
                                 name="title"
                                 type="text"
                                 value={formData.title}
                                 onChange={handleChange}
                                 placeholder="e.g. Premium Cotton T-Shirt"
                                 className={inputCls}
                                 required
                              />
                           </Field>

                           <Field label="Description" htmlFor="description">
                              <textarea
                                 id="description"
                                 name="description"
                                 rows={5}
                                 value={formData.description}
                                 onChange={handleChange}
                                 maxLength={MAX_CHARS}
                                 placeholder="Describe your apparel — materials, fit, care instructions..."
                                 className={`${inputCls} resize-y`}
                              />
                              <p className="text-right text-[11px] text-[#666666]">
                                 {formData.description.length} / {MAX_CHARS}
                              </p>
                           </Field>
                        </div>
                     </div>

                     {/* Card 2 — Pricing */}
                     <div className="bg-white border border-[#e5e5e5] rounded-xl p-5 sm:p-7" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.03)" }}>
                        <SectionHeading>Pricing</SectionHeading>
                        <div className="flex flex-col sm:flex-row gap-4">
                           <Field label="Currency" htmlFor="priceCurrency">
                              <div className="relative sm:w-36">
                                 <select
                                    id="priceCurrency"
                                    name="priceCurrency"
                                    value={formData.priceCurrency}
                                    onChange={handleChange}
                                    className={`${inputCls} appearance-none pr-9`}
                                 >
                                    <option value="INR">INR — ₹</option>
                                    <option value="USD">USD — $</option>
                                    <option value="EUR">EUR — €</option>
                                    <option value="GBP">GBP — £</option>
                                 </select>
                                 <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#666666]">
                                    <ChevronDown />
                                 </span>
                              </div>
                           </Field>

                           <div className="flex-1 flex flex-col sm:flex-row gap-4">
                              <Field label="Price Amount" htmlFor="priceAmount">
                                 <input
                                    id="priceAmount"
                                    name="priceAmount"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.priceAmount}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className={inputCls}
                                 />
                              </Field>
                              <Field label="Stock" htmlFor="stock">
                                 <input
                                    id="stock"
                                    name="stock"
                                    type="number"
                                    min="0"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className={inputCls}
                                 />
                              </Field>
                           </div>
                        </div>
                     </div>
                  </div>
                  {/* /LEFT COLUMN */}

                  {/* ══ RIGHT COLUMN — Images ════════════════════════════════ */}
                  <div className="lg:col-span-7">
                     <div className="bg-white border border-[#e5e5e5] rounded-xl p-5 sm:p-7 h-full" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.03)" }}>
                        <div className="flex justify-between items-center mb-1">
                           <SectionHeading>Product Images</SectionHeading>
                           <span className="text-[11px] text-[#666666] -mt-4 sm:-mt-5">
                              {images.length} / {MAX_IMAGES}
                           </span>
                        </div>
                        <p className="text-[12px] sm:text-[13px] text-[#666666] mb-5">
                           Upload up to {MAX_IMAGES} images.{" "}
                           <span className="whitespace-nowrap">
                              First image = cover.
                           </span>
                        </p>

                        {/* Drop Zone */}
                        {images.length < MAX_IMAGES && (
                           <div
                              onClick={() => fileInputRef.current?.click()}
                              onDragOver={(e) => {
                                 e.preventDefault();
                                 setDragOver(true);
                              }}
                              onDragLeave={() => setDragOver(false)}
                              onDrop={handleDrop}
                              className={`
                      border-2 border-dashed rounded-xl
                      flex flex-col items-center justify-center
                      cursor-pointer transition-colors mb-5
                      h-35 sm:h-45 lg:h-50
                      ${dragOver
                                    ? "border-[#000000] bg-[#f5f5f5]"
                                    : "border-[#dddddd] bg-[#fafafa] hover:bg-[#f5f5f5] hover:border-[#000000]"
                                 }
                    `}
                           >
                              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#f5f5f5] flex items-center justify-center mb-2 sm:mb-3">
                                 <UploadIcon />
                              </div>
                              <p className="text-[13px] sm:text-[14px] font-medium text-[#000000] mb-1 text-center px-4">
                                 Drag &amp; drop or{" "}
                                 <span className="text-[#000000] underline underline-offset-2">
                                    browse
                                 </span>
                              </p>
                              <p className="text-[11px] sm:text-[12px] text-[#666666]">
                                 PNG, JPG, WEBP — max 10 MB each
                              </p>
                              <input
                                 ref={fileInputRef}
                                 type="file"
                                 accept="image/*"
                                 multiple
                                 className="hidden"
                                 onChange={(e) => addFiles(e.target.files)}
                              />
                           </div>
                        )}

                        {/* Thumbnail grid */}
                        <div
                           className="grid gap-2.5 mb-3"
                           style={{
                              gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))",
                           }}
                        >
                           {images.map((img, idx) => (
                              <div key={idx} className="relative group aspect-square">
                                 <img
                                    src={img.preview}
                                    alt={`Product image ${idx + 1}`}
                                    className="w-full h-full object-cover rounded-lg border border-[#e5e5e5]"
                                 />
                                 {idx === 0 && (
                                    <span className="absolute bottom-1 left-1 text-[8px] bg-[#000000] text-white rounded px-1 py-0.5 font-bold leading-none tracking-wide">
                                       COVER
                                    </span>
                                 )}
                                 <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white border border-[#e5e5e5] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50"
                                    aria-label="Remove image"
                                 >
                                    <svg
                                       width="9"
                                       height="9"
                                       viewBox="0 0 24 24"
                                       fill="none"
                                       stroke="#666666"
                                       strokeWidth="2.5"
                                       strokeLinecap="round"
                                    >
                                       <line x1="18" y1="6" x2="6" y2="18" />
                                       <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                 </button>
                              </div>
                           ))}

                           {Array.from({ length: MAX_IMAGES - images.length }).map(
                              (_, i) => (
                                 <div
                                    key={`empty-${i}`}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square rounded-lg border border-dashed border-[#dddddd] bg-[#fafafa] flex items-center justify-center cursor-pointer hover:border-[#000000] hover:bg-[#f5f5f5] transition-colors"
                                 >
                                    <svg
                                       width="16"
                                       height="16"
                                       viewBox="0 0 24 24"
                                       fill="none"
                                       stroke="#999999"
                                       strokeWidth="2"
                                       strokeLinecap="round"
                                    >
                                       <line x1="12" y1="5" x2="12" y2="19" />
                                       <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                 </div>
                              ),
                           )}
                        </div>

                        <p className="text-[11px] text-[#666666] italic">
                           Drag thumbnails to reorder.
                        </p>
                     </div>
                  </div>
                  {/* /RIGHT COLUMN */}
               </div>
               {/* /grid */}

               {/* ── Footer Actions ── */}
               <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-6 pt-6 border-t border-[#e5e5e5] pb-10">
                  <button
                     type="button"
                     onClick={() => navigate(-1)}
                     className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-[#dddddd] text-[#000000] text-[13px] sm:text-[14px] font-semibold hover:bg-[#f5f5f5] transition-colors"
                  >
                     Cancel
                  </button>
                  <button
                     type="submit"
                     className="w-full sm:w-auto px-8 py-2.5 rounded-lg bg-[#000000] text-white text-[13px] sm:text-[14px] font-semibold hover:bg-[#333333] transition-colors active:scale-[0.98]"
                  >
                     Create Product
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default CreateProduct;
