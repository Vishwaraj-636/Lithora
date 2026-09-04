import { createSlice } from "@reduxjs/toolkit";
const productSlice = createSlice({
   name: "product",
   initialState: {
      sellerProducts: [],
      products: [],
   },
   reducers: {
      setSellerProducts: (state, action) => {
         state.sellerProducts = action.payload;
      },
      setProducts: (state, action) => {
         state.products = action.payload;
      },
      updateSellerProduct: (state, action) => {
         const updated = action.payload;
         const idx = state.sellerProducts.findIndex((p) => p._id === updated._id);
         if (idx !== -1) {
            state.sellerProducts[idx] = updated;
         }
      },
   },
});

export const { setSellerProducts, setProducts, updateSellerProduct } = productSlice.actions;
export default productSlice.reducer;

