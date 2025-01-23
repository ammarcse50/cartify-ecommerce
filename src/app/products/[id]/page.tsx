import React, { cache } from "react";
import { PriceTag } from "../../../components/PriceTage";
import Image from "next/image";
import { notFound } from "next/navigation";
import prisma from "@/app/lib/db";
import { Metadata } from "next";
import AddToCartButtonProps from "./AddToCartButton";
import { incrementProductQuantity } from "./action";

interface ProductPageProps {
  params: {
    id: string; // Changed to string since Next.js dynamic route params are strings
  };
}

const getProduct = cache(async (id: string) => {
  // Ensure id is used correctly in the database query
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) }, // Convert id to a number for the database query
  });
  // Handle not found product
  if (!product) {
    notFound();
  }
  return product;
});
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params; // Destructure id from params
  const product = await getProduct(id);
  return {
    title: product.name + " - cartique",
    description: product.description,
    openGraph: {
      images: [{ url: product.imageUrl }],
    },
  };
}

const page = async ({ params }: ProductPageProps) => {
  const { id } = await params; // Destructure id from params
  console.log("id is", id);
  const product = await getProduct(id);

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
      <Image
        src={product?.imageUrl}
        alt={product?.name}
        width={500}
        height={800}
        className="rounded-lg"
        priority
      />
      <div>
        <h1 className="text-5xl font-bold mb-3">{product?.name}</h1>
        <PriceTag price={product?.price} />
        <p className="py-4">{product.description}</p>
        <AddToCartButtonProps
          productId={product.id}
          incrementProductQuantity={incrementProductQuantity}
        />
      </div>
    </div>
  );
};

export default page;
