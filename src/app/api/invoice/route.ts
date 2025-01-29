import { NextRequest, NextResponse } from "next/server";
import prisma from "../../lib/db";

// Custom JSON serialization function to handle BigInt
const json = (param: any): any => {
  return JSON.stringify(
    param,
    (key, value) => {
      if (typeof value === "bigint") {
        return value.toString(); // Convert BigInt to string for JSON serialization
      }
      return value;
    }
  );
};

export async function POST(req: NextRequest) {
  const {
    name,
    mobile,
    total_net_amount,
    total_gross_amount,
    profile_id,
    invoice_details
  } = await req.json();

  try {
    // Ensure profile_id is a string to handle BigInt values
    const profile_id_string = String(profile_id);

    // Find the last invoice to increment serial number
    const lastInvoice = await prisma.invoice.findFirst({
      orderBy: {
        serial_number: "desc", // Get the invoice with the highest serial number
      },
      select: {
        serial_number: true, // Only select the serial_number
      },
    });

    // Increment the serial number by 1 or start at 1 if no invoices exist
    const newSerialNumber = lastInvoice ? lastInvoice.serial_number + 1 : 1;
    const invoiceCode = `INV-${newSerialNumber}-${Date.now()}`;

    // Create a new invoice in the database
    const userInvoice = await prisma.$transaction(async (prisma) => {
      const createInvoice = await prisma.invoice.create({
        data: {
          name: name || "",
          mobile: mobile || "",
          total_net_amount: Number(total_net_amount) || 0,
          total_gross_amount: Number(total_gross_amount) || 0,
          serial_number: newSerialNumber, // Use the incremented serial number
          invoice_code: invoiceCode,
          profile_id: profile_id_string, // Pass profile_id as string
          shipping_address: "", // Assuming empty if not provided
          ip_address: "127.0.0.1", // Default IP address
          created_by: 1, // Assuming default created_by if not provided
          updated_by: 1, // Assuming default updated_by if not provided
          is_active: true, // Assuming invoice is active by default
          is_lock: false, // Assuming not locked by default
          is_settlement: true, // Assuming settlement flag is true
          is_payment_gateway_scheduler_check: false, // Default value
        },
      });

      // Add invoice details if they exist
      const invoiceItemsData = invoice_details.map((item) => ({
        invoice_id: createInvoice.id,
        quantity: item.quantity,
        item_id: item.item_id,
      }));

      // Save invoice details to the database
      await prisma.invoice_details.createMany({
        data: invoiceItemsData,
      });

      console.log(createInvoice);
      console.log(invoiceItemsData);

      // Return the created invoice
      return createInvoice;
    });

    // Return response with the created invoice
    return NextResponse.json(
      { message: "Invoice created successfully", invoice: json(userInvoice) },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating invoice:", error);
    // Handle the error and send a proper response
    return NextResponse.json({ success: false, error: error.message || "Unknown error" });
  }
}
