import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from "../../features/auth/hook/useAuth.js";
import { useSelector } from 'react-redux';
import { useCart } from "../../features/cart/hook/useCart.js";


const Nav = () => {

   const navigate = useNavigate();
   const { handleLogout } = useAuth();
   const { handleGetCart } = useCart();
   const user = useSelector(state => state.auth.user);
   const cartItems = useSelector(state => state.cart?.items || []);
   const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

   useEffect(() => {
      if (user) {
         handleGetCart();
      }
   }, [user, handleGetCart]);



   return (
      <nav className="sticky top-0 z-20 bg-[#ffffff]/90 backdrop-blur-md border-b border-[#e5e5e5]">
         <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 h-14 flex items-center justify-between">
            <span className="text-xl sm:text-2xl tracking-[-0.04em] text-[#000000] cursor-pointer" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }} onClick={() => navigate("/")}>
               Meera M&amp;G
            </span>
            {!user ? (
               <div className="flex items-center gap-3 sm:gap-4">
                  <a href="/login" className="text-[13px] text-[#666666] hover:text-[#000000] transition-colors">Sign in</a>
                  <a href="/register" className="px-3 sm:px-4 py-1.5 rounded-lg bg-[#000000] text-white text-[12px] sm:text-[13px] font-semibold hover:bg-[#333333] transition-colors">Register</a>
               </div>
            ) : (
               <div className="flex items-center gap-3 sm:gap-4">
                  <button onClick={() => navigate("/cart")} className="relative p-2 text-[#000000] hover:bg-gray-100 rounded-full transition-colors" aria-label="Cart">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                     </svg>
                     {cartCount > 0 && (
                        <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-600 rounded-full transform translate-x-1 -translate-y-1">
                           {cartCount}
                        </span>
                     )}
                  </button>
                  <button onClick={handleLogout} className="px-3 sm:px-4 py-1.5 rounded-lg bg-[#000000] text-white text-[12px] sm:text-[13px] font-semibold hover:bg-[#333333] transition-colors">Logout</button>
               </div>
            )}
         </div>
      </nav>
   );
};

export default Nav;