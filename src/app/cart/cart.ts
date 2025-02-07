import { cookies } from "next/headers";
import prisma from "../lib/db";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOption } from "../api/auth/[...nextauth]/route";

export type CartWithProducts = Prisma.cartGetPayload<{
  include: {
    items: {
      include: {
        product: true;
      };
    };
  };
}>;

export type CartItemWithProduct = Prisma.cartitemGetPayload<{
  include: { product: true };
}>;

export type ShoppingCart = CartWithProducts & {
  size: number;
  subtotal: number;
};

export async function getCart(): Promise<ShoppingCart | null> {
  try {
    const cookieStore = await cookies();
    const localCartId = cookieStore.get("localCartId")?.value;
    const cart = localCartId
      ? await prisma.cart?.findFirst({
        where: { id: Number(localCartId) },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })
      : null;

    if (!cart) {
      return null;
    }

    return {
      ...cart,
      size: cart.items.reduce((acc, item) => acc + item.quantity, 0),
      subtotal: cart.items.reduce(
        (acc, item) => acc + item.quantity * Number(item.product.price),
        0
      ),
    };
  } catch (error) {
    console.error("Error fetching cart:", error);
    return null;
  }
}

export async function createCart(): Promise<ShoppingCart> {
  const session = await getServerSession(authOption);
  const email = session?.user?.email;
  console.log("email", email);


  // Fetch user data
  const user = await prisma.users.findFirst({
    where: { email },
  });
  try {
    const newCart = await prisma.cart.create({
      data: {
        userId: user?.id,
      }
    });
    // Set cookie for `localCartId`
    const cookieStore = await cookies();
    cookieStore.set("localCartId", newCart.id.toString(), {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    console.log("from new cart", newCart);
    return {
      ...newCart,
      items: [],
      size: 0,
      subtotal: 0,
    };
  } catch (error) {
    console.error("Error creating cart:", error);
    throw new Error("Failed to create cart");
  }
}
