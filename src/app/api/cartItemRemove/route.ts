import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";



export async function DELETE(req: NextRequest) {


    const { id } = await req.json();

    console.log("id is here", id);

    try {
        const product = await prisma.cartitem.delete({ where: { id: id } });
        return NextResponse.json({ message: "Remove Cart item successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting cart:", error);
        return NextResponse.json(
            { message: "Error deleting cart" },
            { status: 500 }
        );
    }
}
