import ProductCard from "../../components/ProductCard";
import prisma from "../lib/db";

interface SearchPageProps {
  searchParams: { query: string };
}

export default async function searchPage({
  searchParams: {query},
}: SearchPageProps) {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query } },
        { description: { contains: query} },
      ],
    },
    orderBy: { id: "desc" },
  });

  if (products.length === 0) {
    return <div className="text-center">no product found!!</div>;
  }

  return (
    <div className="my-4 grid  grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </div>
  );
}
