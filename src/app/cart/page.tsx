import CartEntry from "../../components/CartEntry";
import { getCart } from "../lib/cart";
import { formatPrice } from "../lib/format";
import { setProductQuantity } from "./action";

export default async function CartPage() {
  const cart = await getCart();

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">ShoppingCart</h1>
      {cart?.items.map((cartItem) => (
        <CartEntry
          setProductQuantity={setProductQuantity}
          cartItem={cartItem}
          key={cartItem.productId}
        />
      ))}
      {!cart?.items.length && <p>your cart is empty</p>}
       <div className="flex flex-col items-end">
          <p className="mb-3 font-bold">
            Total: {formatPrice(cart?.subtotal || 0)}
          </p>
          <button className="btn bg-yellow-500">Check Out</button>
       </div>
    </div>
  );
}
