import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";


// Custom JSON serialization function
const json = (param: any): any => {
  return JSON.stringify(
    param,
    (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
  );
};

export async function POST(req: NextRequest) {
  const { name, total } = await req.json();
  console.log(name, total);

  try {
    // Find the last invoice to increment serial number
    const lastInvoice = await prisma.invoice.findFirst({
      orderBy: {
        serial_number: "desc",
      },
      select: {
        serial_number: true,
      },
    });

    const newSerialNumber = lastInvoice ? lastInvoice.serial_number + 1 : 1;
    const invoiceCode = `INV-${newSerialNumber}-${Date.now()}`;

    // Create a new invoice in the database
    const invoice = await prisma.invoice.create({
      data: {
        name: name || "",
        mobile: "",

        total_net_amount: total,
        total_gross_amount: total,
        serial_number: newSerialNumber,
        invoice_code: invoiceCode,
        invoice_type_id: 1,
        profile_id: 1,
        shipping_address: "",
        ip_address: "127.0.0.1",
        created_by: 1,
        updated_by: 1,
        is_active: true,
        is_payment_gateway_scheduler_check: false,
      },
    });

    // Respond with success using the custom JSON function
    return NextResponse.json({ success: true, invoice: JSON.parse(json(invoice)) });

  } catch (error) {
    console.error("Error creating invoice:", error);
    // Handle the error and send a proper response
    return NextResponse.json({ success: false, error: error });
  }
}
