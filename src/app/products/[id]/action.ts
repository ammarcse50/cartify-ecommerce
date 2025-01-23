"use server";

import { createCart, getCart } from "@/app/lib/cart";
import prisma from "@/app/lib/db";
import { revalidatePath } from "next/cache";

export async function incrementProductQuantity(productId: number) {
  const cart = (await getCart()) ?? (await createCart());
  const articleCart = cart.items.find((item) => item.productId === productId);
  
  if (articleCart) {
    await prisma.cartitem.update({
      where: {
        id: articleCart.id,
      },
      data: { quantity: { increment: 1 } },
    });
  } else {
    await prisma.cartitem.create({
      data: {
        cartId: Number(cart.id),
        productId,
        quantity: 1,
      },
    });
  }

  // Pass the exact path to revalidate
  revalidatePath(`/products/${productId}`);
}
