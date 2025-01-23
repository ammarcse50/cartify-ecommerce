import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/app/assets/logo.png";
import { redirect } from "next/navigation";
import { getCart } from "@/app/lib/cart";
import ShoppingCartButton from "./ShoppingCartButton";
import NavClient from "./NavClient";

// Server-side search logic
export async function searchProduct(formdata: FormData) {
  "use server";
  const searchQuery = formdata.get("searchQuery")?.toString();
  if (searchQuery) {
    redirect("/search?query=" + searchQuery);
  }
}

// Navbar Component
const Navbar = async () => {
  const cart = await getCart();

  return (
    <div className="bg-base-100">
      <div className="navbar max-w-7xl m-auto flex-col sm:flex-row ">
       
        <div className="flex-1">
          <Link href={"/"} className="text-xl normal-case  md:font-bold  flex items-center">
            <Image
              src={logo}
              alt="cartique"
              width={40}
              height={40}
              className="rounded-full  inline-block mr-2"
            />
            CARTIQUE
          </Link>
        </div>

    
        <div className="flex-none gap-4">
  
          <form action={searchProduct}>
            <div className="form-control">
              <input
                name="searchQuery"
                placeholder="searchQuery"
                className="input input-bordered w-full min-w-[200px]"
              />
            </div>
          </form>

          <div>
            <ShoppingCartButton cart={cart} />
          </div>
          <div>
            <NavClient />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
