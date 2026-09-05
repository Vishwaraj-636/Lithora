import React, { useEffect } from 'react';
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

   const cartCount = cartItems.reduce(
      (total, item) => total + (item.quantity || 1),
      0
   );

   useEffect(() => {
      if (user) {
         handleGetCart();
      }
   }, [user, handleGetCart]);

   const githubRepo = "YOUR_GITHUB_REPO_URL";

   return (
      <nav className="sticky top-0 z-20 bg-[#ffffff]/90 backdrop-blur-md border-b border-[#e5e5e5]">
         <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 h-14 flex items-center justify-between">

            {/* Logo */}
            <span
               className="text-xl sm:text-2xl tracking-[-0.04em] text-[#000000] cursor-pointer"
               style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 300
               }}
               onClick={() => navigate("/")}
            >
               WEARTH
            </span>

            {!user ? (
               <div className="flex items-center gap-3 sm:gap-4">

                  {/* GitHub */}
                  <a
                     href="https://github.com/Vishwaraj-636/Wearth"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="p-2 text-[#000000] hover:bg-gray-100 rounded-full transition-colors"
                     aria-label="View project on GitHub"
                     title="View project on GitHub"
                  >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                     >
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.455-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.087.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.58 9.58 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.337-.012 2.415-.012 2.744 0 .268.18.579.688.481A10.001 10.001 0 0 0 22 12C22 6.477 17.523 2 12 2Z"
                        />
                     </svg>
                  </a>

                  <a
                     href="/login"
                     className="text-[13px] text-[#666666] hover:text-[#000000] transition-colors"
                  >
                     Sign in
                  </a>

                  <a
                     href="/register"
                     className="px-3 sm:px-4 py-1.5 rounded-lg bg-[#000000] text-white text-[12px] sm:text-[13px] font-semibold hover:bg-[#333333] transition-colors"
                  >
                     Register
                  </a>
               </div>
            ) : (
               <div className="flex items-center gap-3 sm:gap-4">

                  {/* GitHub */}
                  <a
                        href="https://github.com/Vishwaraj-636/Wearth"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="p-2 text-[#000000] hover:bg-gray-100 rounded-full transition-colors"
                     aria-label="View project on GitHub"
                     title="View project on GitHub"
                  >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                     >
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.455-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.087.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.58 9.58 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.337-.012 2.415-.012 2.744 0 .268.18.579.688.481A10.001 10.001 0 0 0 22 12C22 6.477 17.523 2 12 2Z"
                        />
                     </svg>
                  </a>

                  {/* Cart */}
                  <button
                     onClick={() => navigate("/cart")}
                     className="relative p-2 text-[#000000] hover:bg-gray-100 rounded-full transition-colors"
                     aria-label="Cart"
                  >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                     >
                        <circle cx="8" cy="21" r="1" />
                        <circle cx="19" cy="21" r="1" />
                        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                     </svg>

                     {cartCount > 0 && (
                        <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full transform translate-x-1 -translate-y-1">
                           {cartCount}
                        </span>
                     )}
                  </button>

                  {/* Logout */}
                  <button
                     onClick={handleLogout}
                     className="px-3 sm:px-4 py-1.5 rounded-lg bg-[#000000] text-white text-[12px] sm:text-[13px] font-semibold hover:bg-white hover:text-black border-2 transition-colors cursor-pointer"
                  >
                     Logout
                  </button>
               </div>
            )}
         </div>
      </nav>
   );
};

export default Nav;