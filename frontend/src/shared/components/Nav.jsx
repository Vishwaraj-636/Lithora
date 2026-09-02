import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from "../../features/auth/hook/useAuth.js";
import { useSelector } from 'react-redux';


const Nav = () => {

   const navigate = useNavigate();
   const { handleLogout } = useAuth();
   const user = useSelector(state => state.auth.user);



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
                  <button onClick={handleLogout} className="px-3 sm:px-4 py-1.5 rounded-lg bg-[#000000] text-white text-[12px] sm:text-[13px] font-semibold hover:bg-[#333333] transition-colors">Logout</button>
               </div>
            )}
         </div>
      </nav>
   );
};

export default Nav;