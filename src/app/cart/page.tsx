import CartEntry from "../../components/CartEntry";
import { getCart } from "./cart";
import { formatPrice } from "../lib/format";
import { setProductQuantity } from "./action";
import { authOption } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import ButtonTotalCart from "@/components/ButtonTotalCart";
import prisma from "../lib/db";

export default async function CartPage() {
  const cart = await getCart();
  const session = await getServerSession(authOption);
  console.log(session?.user);
  const email = session?.user?.email;
  const exist = await prisma.users.findFirst({
    where: { email },
  });

  console.log(exist);

  if (!session?.user) {
    return (
      <div>
        <h1 className="mb-6 text-3xl font-bold">Shopping Cart</h1>
        <p>Please log in to view your cart.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold ">Shopping Cart</h1>
      {cart?.items.length ? (
        cart.items.map((cartItem) => (
          <CartEntry
            setProductQuantity={setProductQuantity}
            cartItem={cartItem}
            key={cartItem.productId}
          />
        ))
      ) : (
        <p>Your cart is empty</p>
      )}

      <div className="flex flex-col items-end">
        <p className="mb-3 font-bold">
          Total: {formatPrice(cart?.subtotal || 0)}
        </p>

        <ButtonTotalCart
          email={session.user.email}
          name={session.user.name}
          total={cart?.subtotal || 0}
          mobile={exist?.phone || ""} // Assuming phone might be available in session
          profile_id={exist?.id || 0} // Ensure profile_id is passed as a string
          invoice_details={cart?.items.map((item) => ({
            quantity: item.quantity,
            item_id: item.productId,
          }))}
        />
      </div>
    </div>
  );
}
