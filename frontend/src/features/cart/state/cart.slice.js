import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
   name: 'cart',
   initialState: {
      items: [],

   },
   reducers: {
      setItems: (state, action) => {
         state.items = action.payload;
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
      }
   }
})


export const { setItems, addItem, increamentCartItem, decreamentCartItem } = cartSlice.actions;
export default cartSlice.reducer;