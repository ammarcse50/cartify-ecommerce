import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Serialize BigInt to String
const serializeBigInt = (param: any): any => {
    return JSON.stringify(
        param,
        (key, value) => (typeof value === "bigint" ? value.toString() : value) // Convert BigInt to string for JSON serialization
    );
};

export async function POST(req: NextRequest) {
    const { name, email, total, invoice_id } = await req.json();
    console.log(name, email, total, invoice_id);

    // Check if any required fields are missing
    if (!email || !name || !total || !invoice_id) {
        return new Response(JSON.stringify({ error: 'Missing required information.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        // Create entry in emailScheduler table
        const resheduler = await prisma.emailscheduler.create({
            data: {
                name: name,
                email: email,
                total: total,
                invoice_id: invoice_id, // Ensure invoice_id is passed correctly
            },
        });

        // Use the serializeBigInt function to convert BigInt values to strings
        const responseData = JSON.parse(serializeBigInt({ resheduler }));

        // Return the response with the created entry (responseData contains serialized BigInt)
        return NextResponse.json({ resheduler: responseData }, { status: 200 });

    } catch (error) {
        console.error('Error during email scheduler creation:', error);

        // Return error response in case of an exception
        return new Response(
            JSON.stringify({ error: 'An error occurred while processing the request.' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}
