import Image from "next/image";
import prisma from "./lib/db";
import Link from "next/link";
import PaginationBar from "../components/PaginationBar";
import ProductCard from "../components/ProductCard";

interface HomeProps {
  searchParams: { page?: string | number };
}
export default async function Home({
  searchParams: { page = "1" },
}: HomeProps) {
  const currrentPage = parseInt(page);

  const itemsPerPage = 5;
  const heroItemCount = 1; //  for feature product we hold a array number of product

  //  step 1: get the total number of product

  const totalItemCount = await prisma.products?.count() ;
  //  step2: number of item per page

  const totalPages = Math.ceil(totalItemCount / itemsPerPage);

  // page count: totalItems / itemPerPage

  const products = await prisma.products.findMany({
    orderBy: { id: "desc" },

    skip:
      (currrentPage - 1) * itemsPerPage +
      (currrentPage === 1 ? 0 : heroItemCount),
      take: itemsPerPage + (currrentPage === 1 ? heroItemCount : 0),
  });

  return (
    <div className="flex flex-col items-center">
      {currrentPage === 1 && (
        <div className="hero bg-base-200">
          <div className="hero-content flex-col lg:flex-row ">
            <Image
              src={products[1]?.imageUrl}
              alt={products[1]?.name}
              width={500}
              height={800}
              className="max-w-sm rounded-lg shadow-2xl"
              priority
            />
            <div className="">
              <h1 className="text-5xl font-bold">{products[1]?.name}</h1>
              <p className="py-6">{products[1]?.description}</p>
              <Link
                href={"/products/" + products[1]?.id}
                className="px-4 py-2 bg-blue-500 text-white inline-block rounded-md hover:bg-blue-600 transition"
              >
                Check It Out
              </Link>
            </div>
          </div>
        </div>
      )}
      <div className="my-4 grid  grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {(currrentPage === 1 ? products.slice(2) : products).map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>

      {totalPages > 1 && (
        <PaginationBar currrentPage={currrentPage} totalPages={totalPages} />
      )}
    </div>
  );
}
