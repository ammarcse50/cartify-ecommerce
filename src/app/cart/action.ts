"use server";
import { revalidatePath } from "next/cache";
import { createCart, getCart } from "./cart";
import prisma from "../lib/db";

export async function setProductQuantity(productId: number, quantity: number) {
  const cart = (await getCart()) ?? (await createCart());

  // Ensure cart.items is an array before using `find`
  const articleCart = Array.isArray(cart.items) ? cart.items.find((item) => item.productId === productId) : null;

  if (quantity === 0) {
    if (articleCart) {
      await prisma.cartitem.delete({
        where: { id: articleCart.id },
      });
    }
  } else {
    if (articleCart) {
      await prisma.cartitem.update({
        where: { id: articleCart.id },
        data: { quantity },
      });
    } else {
      await prisma.cartitem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity: 1,
        },
      });
    }
  }
  revalidatePath("/cart");
}
