import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
   name: 'cart',
   initialState: {
      totalPrice: null,
      tax: null,
      finalTotal: null,
      currency: null,
      items: [],
   },
   reducers: {
      setItems: (state, action) => {
         state.items = action.payload.items || [];
         state.totalPrice = action.payload.totalPrice || 0;
         state.tax = action.payload.tax || 0;
         state.finalTotal = action.payload.finalTotal || 0;
         state.currency = action.payload.currency || 'INR';
      },
      addItem: (state, action) => {
         state.items.push(action.payload);
      },

      increamentCartItem: (state, action) => {
         const { productId, variantId } = action.payload;

         state.items = state.items.map(item => {
            const currentProductId = item.product?._id || item.product || item.productId;
            const currentVariantId = item.variant?._id || item.variant || item.variantId;

            if (
               String(currentProductId) === String(productId) &&
               (currentVariantId?.toString() ?? null) === (variantId?.toString() ?? null)
            ) {
               return { ...item, quantity: item.quantity + 1 }
            }
            else {
               return item;
            }
         })
      },
      decreamentCartItem: (state, action) => {
         const { productId, variantId } = action.payload;

         state.items = state.items.map(item => {
            const currentProductId = item.product?._id || item.product || item.productId;
            const currentVariantId = item.variant?._id || item.variant || item.variantId;

            if (
               String(currentProductId) === String(productId) &&
               (currentVariantId?.toString() ?? null) === (variantId?.toString() ?? null)
            ) {
               return { ...item, quantity: Math.max(1, item.quantity - 1) }
            }
            else {
               return item;
            }
         })
      },
      removeItemFromCart: (state, action) => {
         const { productId, variantId } = action.payload;

         state.items = state.items.filter(item => {
            const currentProductId = item.product?._id || item.product || item.productId;
            const currentVariantId = item.variant?._id || item.variant || item.variantId;

            return !(String(currentProductId) === String(productId) &&
               (currentVariantId?.toString() ?? null) === (variantId?.toString() ?? null));
         });
      },
      clearCartItems: (state) => {
         state.items = [];
      }
   }
})


export const { setItems, addItem, increamentCartItem, decreamentCartItem, removeItemFromCart, clearCartItems } = cartSlice.actions;
export default cartSlice.reducer;