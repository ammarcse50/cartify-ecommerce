import Image from "next/image";
import prisma from "./lib/db";
import Link from "next/link";
import PaginationBar from "../components/PaginationBar";
import ProductCard from "../components/ProductCard";





interface HomeProps {
  searchParams: { page: string };
}
export default async function Home({
  searchParams: { page = "1" },
}: HomeProps) {
  const currrentPage = parseInt(page);

  const pageSize = 5;
  const heroItemCount = 1;

  const totalItemCount = await prisma.product.count();

  const totalPages = Math.ceil((totalItemCount - heroItemCount) / pageSize);

  const products = await prisma.product.findMany({
    orderBy: { id: "desc" },

    skip:
      (currrentPage - 1) * pageSize + (currrentPage === 1 ? 0 : heroItemCount),
    take: pageSize + (currrentPage === 1 ? heroItemCount : 0),
  });
  console.log(products);

  return (
    <div>

      <div className="hero bg-base-200">
        <div className="hero-content flex-col lg:flex-row ">
          <Image
            src={products[1]?.imageUrl}
            alt={products[1]?.name}
            width={400}
            height={800}
            className="max-w-sm rounded-lg shadow-2xl"
            priority
          />
          <div className="">
            <h1 className="text-5xl font-bold">{products[1]?.name}</h1>
            <p className="py-6">{products[1]?.description}</p>
            <Link
              href={"/products/" + products[1].id}
              className="px-4 py-2 bg-blue-500 text-white inline-block rounded-md hover:bg-blue-600 transition"
            >
              Check It Out
            </Link>
          </div>
        </div>
      </div>
      <div className="my-4 grid  grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {" "}
        {products.slice(1).map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
      {totalPages > 1 && (
        <PaginationBar currrentPage={currrentPage} totalPages={totalPages} />
      )}
    </div>
  );
}
