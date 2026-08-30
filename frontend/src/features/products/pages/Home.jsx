import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useProduct } from '../hook/useProduct';
import { useNavigate } from 'react-router';


/* ── Currency symbol map ── */
const CURRENCY_SYMBOLS = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };

/* ── Image placeholder ── */
const ImagePlaceholder = () => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-[#211f1b]">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
      stroke="#3a322c" strokeWidth="1.5" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
    <p className="text-[10px] text-[#3a322c] mt-2">No image</p>
  </div>
);

/* ── Shopping bag icon ── */
const BagIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

/* ── Product Card ── */
const ProductCard = ({ product }) => {
  const symbol = CURRENCY_SYMBOLS[product.price?.currency] ?? product.price?.currency ?? '';
  const coverUrl = product.images?.[0]?.url ?? null;
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="bg-[#211f1b] border border-[#3a322c] rounded-xl overflow-hidden flex flex-col hover:border-[#b58a5a] transition-colors duration-200 group">

      {/* Cover image */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-[#1a1815]">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <ImagePlaceholder />
        )}

        {/* Image count badge */}
        {product.images?.length > 0 && (
          <span className="absolute bottom-2 right-2 text-[10px] font-semibold bg-black/60 text-[#f2ede6] rounded px-1.5 py-0.5 backdrop-blur-sm">
            {product.images.length} {product.images.length === 1 ? 'photo' : 'photos'}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-4 sm:p-5 flex flex-col gap-2 flex-1">
        <h3 className="text-[15px] font-semibold text-[#f2ede6] leading-snug line-clamp-2 capitalize">
          {product.title}
        </h3>

        {product.description && (
          <p className="text-[12px] text-[#a9a49b] leading-relaxed line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between border-t border-[#2e2a25]">
          <span className="text-[17px] font-bold text-[#b58a5a]">
            {symbol}{Number(product.price?.amount ?? 0).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <button
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#b58a5a] text-white text-[12px] font-semibold hover:bg-[#c49a68] transition-colors active:scale-[0.97]"
          >
            <BagIcon />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   Home
════════════════════════════════════════════ */
const Home = () => {
  const products = useSelector((state) => state.product.products);
  const user = useSelector((state) => state.auth.user);
  const { handleGetAllProducts } = useProduct();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      await handleGetAllProducts();
      setLoading(false);
    };
    fetchProducts();
  }, []);

  /* Loading */
  if (loading) {
    return (
      <div
        className="min-h-screen bg-[#18150f] flex items-center justify-center"
        style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#3a322c] border-t-[#b58a5a] rounded-full animate-spin" />
          <p className="text-[13px] text-[#a9a49b] tracking-wide">Loading catalogue…</p>
        </div>
      </div>
    );
  }

  /* Empty */
  if (!products || products.length === 0) {
    return (
      <div
        className="min-h-screen bg-[#18150f] flex items-center justify-center"
        style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
      >
        <div className="text-center">
          <p className="text-[32px] mb-3">🛍️</p>
          <h2 className="text-[18px] font-semibold text-[#f2ede6]">No products yet</h2>
          <p className="mt-2 text-[13px] text-[#a9a49b]">Check back soon — new slabs are being added.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#18150f] text-[#f2ede6] flex flex-col"
      style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
    >

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-10 bg-[#18150f]/90 backdrop-blur border-b border-[#3a322c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 h-14 flex items-center justify-between">
          <span
            className="text-2xl tracking-[-0.04em] text-[#f2ede6]"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
          >
            Meera M&amp;G
          </span>
          {!user && (
            <div className="flex items-center gap-4">
              <a href="/login" className="text-[13px] text-[#a9a49b] hover:text-[#f2ede6] transition-colors">
                Sign in
              </a>
              <a
                href="/register"
                className="px-4 py-1.5 rounded-lg bg-[#b58a5a] text-white text-[13px] font-semibold hover:bg-[#c49a68] transition-colors"
              >
                Register
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-14 pb-10 sm:pt-16 sm:pb-12">
        <p className="text-[10px] sm:text-[11px] tracking-[0.08em] uppercase text-[#a9a49b] font-semibold mb-3">
          Home
          <span className="mx-1.5 opacity-50">/</span>
          <span className="text-[#f2ede6]">All Products</span>
        </p>
        <h1 className="text-[28px] sm:text-[36px] lg:text-[48px] font-semibold text-[#f2ede6] leading-tight tracking-tight mb-2">
          Our Stone Collection
        </h1>
        <p className="text-[14px] sm:text-[16px] text-[#a9a49b] leading-relaxed max-w-xl">
          Premium marble and granite slabs sourced directly from the quarry. Quality stone for every space.
        </p>
        <div className="h-px bg-[#3a322c] w-full mt-8" />
      </div>

      {/* ── Products Grid ── */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pb-16">
        <p className="text-[11px] text-[#5a5048] uppercase tracking-[0.08em] font-semibold mb-5">
          {products.length} {products.length === 1 ? 'item' : 'items'}
        </p>

        <div
          className="grid gap-5"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}
        >
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[#3a322c] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span
            className="text-xl tracking-[-0.04em] text-[#f2ede6]"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
          >
            Meera M&amp;G
          </span>
          <p className="text-[11px] text-[#5a5048]">
            © {new Date().getFullYear()} Meera M&amp;G. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default Home;