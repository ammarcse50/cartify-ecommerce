import prisma from "@/app/lib/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get("page") || "1";
  const limit = req.nextUrl.searchParams.get("limit") || "10";

  console.log("page", page);
  const pageInt = parseInt(page);
  const limitInt = parseInt(limit);

  const products = await prisma.products.findMany({
    skip: (pageInt - 1) * limitInt,
    take: limitInt,
  });

  const total = await prisma.products.count();

  return new Response(
    JSON.stringify({
      data: products,
      total,
      page: pageInt,
      totalPages: Math.ceil(total / limitInt),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
