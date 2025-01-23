"use client";

import { CartItemWithProduct } from "@/app/lib/cart";
import { formatPrice } from "@/app/lib/format";
import Image from "next/image";
import Link from "next/link";
import { JSX, useEffect, useState, useTransition } from "react";

interface CartEntryPage {
  cartItem: CartItemWithProduct;
  setProductQuantity: (productId: number, quantity: number) => Promise<void>;
}

export default function CartEntry({
  cartItem: { product, quantity },
  setProductQuantity,
}: CartEntryPage) {
  
  const [isPending, startTransition] = useTransition();
  const [proQuantity,setQuantity]= useState(quantity)


  // useEffect(()=>{

  //   return 


  // },[product,quantity])

  // const quantityOptions: JSX.Element[] = [];
  // for (let i = 1; i <= 99; i++) {
  //   quantityOptions.push(
  //     <option value={1} key={i}>
  //       {i}
  //     </option>
  //   );
  // }
  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <Image
          src={product?.imageUrl}
          alt={product?.name}
          width={200}
          height={200}
          className="rounded-lg"
        />
        <div>
          <Link href={"/products/" + product.id} className="font-bold">
            {product.name}
          </Link>
          <div>price: {formatPrice(product?.price)}</div>
          <div className="my-1 flex items-center gap-2">
            Quantity: <input type="number" onChange={e=>setQuantity(e.target.value)} className="input input-bordered w-10" max={30} min={1} />
            {/* <select
              className="select select-bordered w-full max-w-[80px]"
              onChange={(e) => {
                const newQuantity = parseInt(e.currentTarget.value);
                startTransition(async () => {
                  await setProductQuantity(product?.id, newQuantity);
                });
              }}
              defaultValue={quantity}
            >
             
            </select> */}
          </div>
          <div>Total:{formatPrice(product?.price * proQuantity)}</div>
          {isPending && <span className="loading loading-spinner loading-sm" />}
        </div>
      </div>
    </div>
  );
}
