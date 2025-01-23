import { cookies } from "next/headers";
import prisma from "./db";
import { Prisma } from "@prisma/client";

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
      ? await prisma.cart.findFirst({
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
  try {
    const newCart = await prisma.cart.create({
      data: {},
    });

    // Set cookie for `localCartId`
    const cookieStore = await cookies();
    cookieStore.set("localCartId", newCart.id.toString(), {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

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
