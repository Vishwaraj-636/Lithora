import {addItem} from "../services/cart.api.js";
import {useDispatch} from "react-redux";
import {addItem as addItemToCart} from "../state/cart.slice.js";

export const useCart = () => {
   const dispatch = useDispatch();

   async function handleAddItem({productId, variantId}) {
      const data = await addItem({productId, variantId});
      // dispatch(addItemToCart(data.item));

      return data;
   }

   return { handleAddItem };
}