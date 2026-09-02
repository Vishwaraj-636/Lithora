import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hook/useCart";

/* ── Icons ── */
const ArrowLeftIcon = () => (
   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
   </svg>
);

const TrashIcon = () => (
   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
   </svg>
);

const MinusIcon = () => (
   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
   </svg>
);

const PlusIcon = () => (
   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
   </svg>
);

const LockIcon = () => (
   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
   </svg>
);

const ImagePlaceholder = ({ small = false }) => (
   <div className={`w-full h-full flex flex-col items-center justify-center bg-[#fafafa] ${small ? "gap-1" : "gap-3"}`}>
      <svg width={small ? "24" : "48"} height={small ? "24" : "48"} viewBox="0 0 24 24" fill="none" stroke="#cccccc" strokeWidth="1.5" strokeLinecap="round">
         <rect x="3" y="3" width="18" height="18" rx="2" />
         <circle cx="8.5" cy="8.5" r="1.5" />
         <polyline points="21 15 16 10 5 21" />
      </svg>
   </div>
);

const Cart = () => {
   const navigate = useNavigate();
   const cartItems = useSelector((state) => state.cart.items);
   const { handleGetCart, handleIncrementItemQuantity,handleDecreamentItemQuantity } = useCart();


   useEffect(() => {
      handleGetCart();
   }, []);

   const subtotal = cartItems?.reduce((acc, item) => acc + (item.price.amount * item.quantity), 0) || 0;
   const estimatedTax = subtotal * 0.18; // Example 18% tax
   const total = subtotal + estimatedTax;

   return (
      <div className="min-h-screen bg-white text-[#000000] font-sans flex flex-col">
         <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-8 sm:py-12 lg:py-16">

            {/* Header */}
            <div className="mb-8 sm:mb-12">
               <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#000000] mb-2">Shopping Cart</h1>
               <p className="text-[14px] sm:text-[15px] text-[#666666]">
                  {cartItems?.length || 0} {cartItems?.length === 1 ? 'item' : 'items'} in your cart
               </p>
            </div>

            {cartItems && cartItems.length > 0 ? (
               <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">

                  {/* Cart Items List */}
                  <div className="w-full lg:w-2/3 flex flex-col gap-6">
                     {cartItems.map((item) => {
                        const variantData = item.variant
                           ? item.product.variants?.find(v => v._id === item.variant)
                           : null;

                        const imageUrl = variantData?.images?.[0]?.url
                           || item.product.images?.[0]?.url;

                        return (
                           <div key={item._id} className="flex flex-col sm:flex-row gap-4 sm:gap-6 pb-6 border-b border-[#e5e5e5] last:border-0">

                              {/* Image */}
                              <div className="w-full sm:w-32 h-32 shrink-0 rounded-xl overflow-hidden bg-[#fafafa] border border-[#e5e5e5]">
                                 {imageUrl ? (
                                    <img src={imageUrl} alt={item.product.title} className="w-full h-full object-cover" />
                                 ) : (
                                    <ImagePlaceholder small />
                                 )}
                              </div>

                              {/* Details */}
                              <div className="flex flex-col justify-between flex-grow">
                                 <div className="flex justify-between items-start">
                                    <div>
                                       <h3 className="text-[16px] sm:text-[18px] font-semibold text-[#000000] mb-1 capitalize">
                                          {item.product.title}
                                       </h3>
                                       <p className="text-[13px] sm:text-[14px] text-[#666666] mb-3">
                                          {item.product.description}
                                       </p>

                                       {variantData?.attributes && (
                                          <div className="flex flex-wrap gap-x-4 gap-y-1">
                                             {Object.entries(variantData.attributes).map(([key, value]) => (
                                                <div key={key} className="text-[11px] sm:text-[12px] uppercase tracking-[0.05em]">
                                                   <span className="text-[#999999]">{key}: </span>
                                                   <span className="text-[#000000] font-medium">{value}</span>
                                                </div>
                                             ))}
                                          </div>
                                       )}
                                    </div>
                                    <button className="p-2 text-[#999999] hover:text-[#000000] transition-colors rounded-lg hover:bg-[#fafafa]">
                                       <TrashIcon />
                                    </button>
                                 </div>

                                 <div className="flex justify-between items-end mt-4">
                                    <div className="flex items-center rounded-xl border border-[#e5e5e5] h-9 sm:h-10">
                                       <button 
                                       onClick={() => handleDecreamentItemQuantity({ productId: item.product._id, variantId: item.variant })}
                                       className="px-3 h-full flex items-center justify-center text-[#666666] hover:text-[#000000] hover:bg-[#fafafa] transition-colors rounded-l-xl">
                                          <MinusIcon />
                                       </button>
                                       <span className="w-8 sm:w-10 text-center text-[13px] sm:text-[14px] font-medium text-[#000000]">
                                          {item.quantity}
                                       </span>
                                       <button
                                          onClick={() => handleIncrementItemQuantity({ productId: item.product._id, variantId: item.variant })}
                                          className="px-3 h-full flex items-center justify-center text-[#666666] hover:text-[#000000] hover:bg-[#fafafa] transition-colors rounded-r-xl">
                                          <PlusIcon />
                                       </button>
                                    </div>
                                    <div className="text-right">
                                       <p className="text-[14px] sm:text-[16px] font-semibold text-[#000000]">
                                          ₹{item.price.amount.toLocaleString('en-IN')}
                                       </p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        );
                     })}
                  </div>

                  {/* Order Summary */}
                  <div className="w-full lg:w-1/3">
                     <div className="bg-[#fafafa] border border-[#e5e5e5] rounded-2xl p-6 lg:p-8 sticky top-8">
                        <h2 className="text-[18px] sm:text-[20px] font-semibold text-[#000000] mb-6">Order Summary</h2>

                        <div className="flex flex-col gap-4 mb-6 text-[13px] sm:text-[14px]">
                           <div className="flex justify-between">
                              <span className="text-[#666666]">Subtotal</span>
                              <span className="text-[#000000] font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-[#666666]">Estimated Tax (18%)</span>
                              <span className="text-[#000000] font-medium">₹{estimatedTax.toLocaleString('en-IN')}</span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-[#666666]">Shipping</span>
                              <span className="text-[#000000] font-medium">Calculated at checkout</span>
                           </div>
                        </div>

                        <div className="h-px bg-[#e5e5e5] w-full mb-6" />

                        <div className="flex justify-between items-end mb-8">
                           <span className="text-[16px] font-semibold text-[#000000]">Total</span>
                           <div className="text-right">
                              <span className="text-[20px] sm:text-[24px] font-semibold text-[#000000]">
                                 ₹{total.toLocaleString('en-IN')}
                              </span>
                              <p className="text-[11px] text-[#999999] mt-0.5">Including all taxes</p>
                           </div>
                        </div>

                        <button className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-[#000000] text-white text-[13px] sm:text-[14px] font-semibold tracking-wide hover:bg-[#333333] transition-all duration-200 active:scale-[0.98] shadow-sm">
                           Proceed to Checkout
                        </button>

                        <div className="mt-4 flex items-center justify-center gap-1.5 text-[12px] text-[#666666]">
                           <LockIcon />
                           <span>Secure Encrypted Checkout</span>
                        </div>
                     </div>
                  </div>

               </div>
            ) : (
               <div className="py-20 flex flex-col items-center justify-center text-center bg-[#fafafa] border border-[#e5e5e5] rounded-2xl">
                  <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-white border border-[#e5e5e5]">
                     <ShoppingCartIcon />
                  </div>
                  <h2 className="text-[20px] font-semibold text-[#000000] mb-2">Your cart is empty</h2>
                  <p className="text-[14px] text-[#666666] mb-8 max-w-md">
                     Looks like you haven't added any products to your cart yet. Explore our catalogue to find what you're looking for.
                  </p>
                  <button
                     onClick={() => navigate("/")}
                     className="h-11 px-8 flex items-center justify-center rounded-xl bg-[#000000] text-white text-[13px] sm:text-[14px] font-semibold tracking-wide hover:bg-[#333333] transition-all duration-200 shadow-sm"
                  >
                     Continue Shopping
                  </button>
               </div>
            )}
         </main>

         {/* Back Link */}
         <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pb-8 sm:pb-10 w-full">
            <button onClick={() => navigate("/")} className="inline-flex items-center gap-2 text-[12px] sm:text-[13px] text-[#666666] hover:text-[#000000] transition-colors">
               <ArrowLeftIcon /> Continue Shopping
            </button>
         </div>

         {/* Footer */}
         <footer className="border-t border-[#e5e5e5] py-6 sm:py-8 mt-auto w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
               <span className="text-lg sm:text-xl tracking-[-0.04em] text-[#000000]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>Meera M&amp;G</span>
               <p className="text-[10px] sm:text-[11px] text-[#999999]">© {new Date().getFullYear()} Meera M&amp;G. All rights reserved.</p>
            </div>
         </footer>
      </div>
   );
};

// Add ShoppingCartIcon for the empty state
const ShoppingCartIcon = () => (
   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
   </svg>
);

export default Cart;