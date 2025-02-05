import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export async function DELETE(req: NextRequest) {
    const { email } = await req.json();
    console.log("email is here", email);
    try {
        if (!email) {
            return NextResponse.json(
                { message: "User not authenticated" },
                { status: 401 }
            );
        }
        const user = await prisma.users.findFirst({
            where: { email },
        });
        console.log("userId is here", user?.id);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        await prisma.cartitem.deleteMany({
            where: {
                cartId: Number(user?.id),
            },
        });
        await prisma.cart.deleteMany({
            where: { userId: Number(user?.id) },
        });
        return NextResponse.json(
            { message: "Cart deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting cart:", error);
        return NextResponse.json(
            { message: "Error deleting cart" },
            { status: 500 }
        );
    }
}
