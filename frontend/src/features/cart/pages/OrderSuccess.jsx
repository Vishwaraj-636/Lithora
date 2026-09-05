import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/* ── Icons ── */
const CheckIcon = () => (
   <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
   </svg>
);

const ArrowLeftIcon = () => (
   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
   </svg>
);

const PackageIcon = () => (
   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
   </svg>
);

const TruckIcon = () => (
   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <path d="M16 8h4l3 5v3h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
   </svg>
);

const MailIcon = () => (
   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
   </svg>
);

const LockIcon = () => (
   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
   </svg>
);

const ChevronRightIcon = () => (
   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
   </svg>
);

/* ── Step Badge ── */
const StepBadge = ({ icon, label, active, done }) => (
   <div className="flex flex-col items-center gap-2">
      <div
         className="flex items-center justify-center rounded-full transition-all duration-300"
         style={{
            width: '36px',
            height: '36px',
            background: done ? '#000000' : active ? '#000000' : 'transparent',
            border: done || active ? '1.5px solid #000000' : '1.5px solid #e5e5e5',
            color: done || active ? '#ffffff' : '#999999',
         }}
      >
         {icon}
      </div>
      <span
         style={{
            fontSize: '11px',
            color: done || active ? '#000000' : '#999999',
            fontWeight: done || active ? '600' : '400',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
         }}
      >
         {label}
      </span>
   </div>
);

/* ── Detail Row ── */
const DetailRow = ({ label, value, badge }) => (
   <div
      className="flex items-center justify-between py-4"
      style={{ borderBottom: '1px solid #f5f5f5' }}
   >
      <span style={{ fontSize: '14px', color: '#666666', fontWeight: '400' }}>
         {label}
      </span>
      {badge ? (
         <span
            style={{
               display: 'inline-flex',
               alignItems: 'center',
               gap: '5px',
               padding: '3px 10px',
               background: '#000000',
               color: '#ffffff',
               fontSize: '11px',
               fontWeight: '600',
               letterSpacing: '0.04em',
               borderRadius: '9999px',
               textTransform: 'uppercase',
            }}
         >
            {value}
         </span>
      ) : (
         <span style={{ fontSize: '14px', color: '#000000', fontWeight: '500' }}>
            {value}
         </span>
      )}
   </div>
);

/* ── Main Component ── */
const OrderSuccess = () => {
   const navigate = useNavigate();
   const params = useParams();
   const [isVisible, setIsVisible] = useState(false);

   // Extract order ID from route param (format: order_Id=<id>)
   const rawParam = params['*'] || params.orderId || '';
   const orderId = rawParam.replace('order_Id=', '') || 'N/A';
   const displayId = orderId !== 'N/A'
      ? orderId.slice(0, 14).toUpperCase()
      : 'ORD-XXXXXXXXXXXX';

   useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), 80);
      return () => clearTimeout(timer);
   }, []);

   // Estimated delivery: today + 5 days
   const deliveryDate = new Date();
   deliveryDate.setDate(deliveryDate.getDate() + 5);
   const formattedDelivery = deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
   });

   return (
      <div className="min-h-screen bg-white text-[#000000] font-sans flex flex-col">

         {/* ── Keyframe styles ── */}
         <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes check-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0.12); }
          50%       { box-shadow: 0 0 0 10px rgba(0,0,0,0); }
        }
        .success-enter {
          animation: fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .success-enter-d1 { animation-delay: 0.05s; }
        .success-enter-d2 { animation-delay: 0.15s; }
        .success-enter-d3 { animation-delay: 0.25s; }
        .check-circle {
          animation: check-pulse 2.5s ease-in-out infinite;
        }
        .btn-primary:hover  { background: #333333 !important; }
        .btn-secondary:hover { background: #f5f5f5 !important; }
      `}</style>

         {/* ── Main ── */}
         <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-8 sm:py-12 lg:py-16">

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 mb-8 sm:mb-10">
               <button
                  onClick={() => navigate('/')}
                  className="text-[12px] text-[#999999] hover:text-[#000000] transition-colors bg-transparent border-none cursor-pointer p-0"
               >
                  Home
               </button>
               <ChevronRightIcon />
               <button
                  onClick={() => navigate('/cart')}
                  className="text-[12px] text-[#999999] hover:text-[#000000] transition-colors bg-transparent border-none cursor-pointer p-0"
               >
                  Cart
               </button>
               <ChevronRightIcon />
               <span className="text-[12px] text-[#000000] font-medium">Order Confirmed</span>
            </div>

            {/* ── Two-column layout on lg, stacked on sm ── */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">

               {/* ── Left: Success State ── */}
               <div className="flex-grow flex flex-col gap-6">

                  {/* Success header */}
                  <div
                     className={`flex flex-col sm:flex-row sm:items-center gap-5 pb-8 ${isVisible ? 'success-enter success-enter-d1' : 'opacity-0'}`}
                     style={{ borderBottom: '1px solid #e5e5e5' }}
                  >
                     {/* Check circle */}
                     <div
                        className="check-circle flex-shrink-0 flex items-center justify-center rounded-full bg-[#000000] text-white"
                        style={{ width: '72px', height: '72px' }}
                     >
                        <CheckIcon />
                     </div>

                     <div>
                        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#000000] mb-2">
                           Order Confirmed!
                        </h1>
                        <p className="text-[14px] sm:text-[15px] text-[#666666]">
                           Thank you for your purchase. Your order has been placed and is being prepared.
                        </p>
                     </div>
                  </div>

                  {/* Order ID */}
                  <div
                     className={`flex flex-col sm:flex-row sm:items-center gap-3 py-5 ${isVisible ? 'success-enter success-enter-d2' : 'opacity-0'}`}
                     style={{ borderBottom: '1px solid #e5e5e5' }}
                  >
                     <span className="text-[12px] uppercase tracking-[0.05em] text-[#999999] font-medium">
                        Order ID
                     </span>
                     <span
                        className="inline-block font-mono text-[13px] sm:text-[14px] font-medium text-[#000000] bg-[#fafafa] border border-[#e5e5e5] rounded-xl px-4 py-2"
                     >
                        {displayId}
                     </span>
                  </div>



                  {/* Order details */}
                  <div className={isVisible ? 'success-enter success-enter-d3' : 'opacity-0'}>
                     <p className="text-[12px] uppercase tracking-[0.05em] text-[#999999] font-medium mb-1">
                        Order Details
                     </p>
                     <DetailRow label="Payment Status" value="Paid" badge />
                     <DetailRow label="Estimated Delivery" value={formattedDelivery} />
                     <DetailRow label="Shipping Method" value="Standard (3–5 Business Days)" />
                  </div>


               </div>

               {/* ── Right: Summary & CTAs ── */}
               <div className="w-full lg:w-1/3 flex-shrink-0">
                  <div
                     className={`bg-[#fafafa] border border-[#e5e5e5] rounded-2xl p-6 lg:p-8 sticky top-8 ${isVisible ? 'success-enter success-enter-d2' : 'opacity-0'}`}
                  >
                     <h2 className="text-[18px] sm:text-[20px] font-semibold text-[#000000] mb-6">
                        What's Next?
                     </h2>

                     {/* Steps */}
                     <div className="flex flex-col gap-5 mb-8">
                        {[
                           { step: '01', title: 'Preparation', desc: 'Your items are being carefully packed.' },
                           { step: '02', title: 'Dispatch', desc: 'We\'ll notify you when your order ships.' },
                           { step: '03', title: 'Delivery', desc: 'Expected by ' + formattedDelivery + '.' },
                        ].map(({ step, title, desc }) => (
                           <div key={step} className="flex gap-4">
                              <span
                                 className="text-[11px] font-semibold text-[#999999] tracking-[0.05em] flex-shrink-0 mt-0.5"
                                 style={{ minWidth: '20px' }}
                              >
                                 {step}
                              </span>
                              <div>
                                 <p className="text-[14px] font-semibold text-[#000000] mb-0.5">{title}</p>
                                 <p className="text-[13px] text-[#666666]">{desc}</p>
                              </div>
                           </div>
                        ))}
                     </div>

                     <div className="h-px bg-[#e5e5e5] w-full mb-6" />

                     {/* CTA buttons */}
                     <div className="flex flex-col gap-3">
                        <button
                           className="btn-primary w-full h-12 flex items-center justify-center rounded-xl bg-[#000000] text-white text-[13px] sm:text-[14px] font-semibold tracking-wide transition-all duration-200 active:scale-[0.98] shadow-sm"
                           onClick={() => navigate('/')}
                           style={{ border: 'none', cursor: 'pointer' }}
                        >
                           Continue Shopping
                        </button>


                     </div>

                     {/* Trust note */}
                     <div className="mt-5 flex items-center justify-center gap-1.5 text-[12px] text-[#666666]">
                        <LockIcon />
                        <span>Secure Encrypted Payment</span>
                     </div>
                  </div>
               </div>

            </div>
         </main>

         {/* ── Back link ── */}
         <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pb-8 sm:pb-10 w-full">
            <button
               onClick={() => navigate('/')}
               className="inline-flex items-center gap-2 text-[12px] sm:text-[13px] text-[#666666] hover:text-[#000000] transition-colors bg-transparent border-none cursor-pointer p-0"
            >
               <ArrowLeftIcon />
               Continue Shopping
            </button>
         </div>

         {/* ── Footer ── */}
         <footer className="border-t border-[#e5e5e5] py-6 sm:py-8 mt-auto w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
               <span
                  className="text-lg sm:text-xl tracking-[-0.04em] text-[#000000]"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
               >
                  WEARTH
               </span>
               <p className="text-[10px] sm:text-[11px] text-[#999999]">
                  © {new Date().getFullYear()} WEARTH. All rights reserved.
               </p>
            </div>
         </footer>

      </div>
   );
};

export default OrderSuccess;