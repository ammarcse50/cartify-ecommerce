"use client";
import { CartItemWithProduct } from "@/app/cart/cart";
import { formatPrice } from "@/app/lib/format";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { RxCrossCircled } from "react-icons/rx";

interface CartEntryPage {
  cartItem: CartItemWithProduct;
  setProductQuantity: (productId: number, quantity: number) => Promise<void>;
}

export default function CartEntry({
  cartItem: { product, quantity, id },
  setProductQuantity,
}: CartEntryPage) {
  const [isPending, startTransition] = useTransition();
  const [proQuantity, setQuantity] = useState(quantity);

  const handleRemoveItem = async () => {
    const removeItem = await fetch("/api/cartItemRemove", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    console.log("removed item response", removeItem);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-3 relative">
        <RxCrossCircled
          onClick={handleRemoveItem}
          className="absolute right-20 top-10"
          size={30}
        />
        <Image
          src={product?.imageUrl}
          alt={product?.name}
          width={200}
          height={200}
          className="rounded-lg"
        />
        <div>
          <Link href={"/products/" + product?.id} className="font-bold">
            {product?.name}
          </Link>
          <div>price: {formatPrice(product?.price)}</div>
          <div className="my-1 flex items-center gap-2">
            Quantity:
            <input
              type="number"
              defaultValue={proQuantity}
              onChange={(e) => {
                const newQuantity = parseInt(e.target.value);
                startTransition(async () => {
                  await setProductQuantity(product?.id, newQuantity);
                });

                setQuantity(newQuantity);
              }}
              className="input input-bordered"
              max={10}
              min={1}
            />
          </div>
          <div>Total:{formatPrice(product?.price * proQuantity)}</div>
          {isPending && <span className="loading loading-spinner loading-sm" />}
        </div>
      </div>
    </div>
  );
}
