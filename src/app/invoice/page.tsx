import React from "react";
import prisma from "../lib/db";
import { authOption } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { formatPrice } from "../lib/format";
import ConfirmPay from "@/components/ConfirmPay";
import { number } from "zod";

const Invoice = async () => {
  const session = await getServerSession(authOption);
  const email = session?.user?.email;
  console.log("email", email);
  // Ensure the user is logged in
  if (!session?.user?.email) {
    return <p>You need to be logged in to view the invoice.</p>;
  }

  // Fetch user data
  const user = await prisma.users.findFirst({
    where: { email },
  });

  const name = user?.username;
  const phone = user?.phone;

  // Fetch the invoice data for the user
  const invoice = await prisma.invoice.findFirst({
    where: { name },
  });

  // Fetch the invoice details based on invoice_id
  const invoiceDetails = await prisma.invoice_details.findMany({
    where: { invoice_id: invoice?.id },
  });

  // Fetch product details based on item_id from invoice_details
  const invoiceItemsWithProducts = await Promise.all(
    invoiceDetails.map(async (item) => {
      const product = await prisma.products.findFirst({
        where: { id: Number(item.item_id) },
      });
      return {
        ...item,
        productName: product?.name || "Product Not Found",
        unitPrice: product?.price || 0,
        quantity: item.quantity || 0,
      };
    })
  );

  console.log(name, email);
  console.log("invoice total", invoice?.total_net_amount);

  console.log("productwith", invoiceItemsWithProducts);

  // If no invoice or details are found, return an error message
  if (!invoice || invoiceDetails.length === 0) {
    return <p>No invoice or items found.</p>;
  }
    console.log("invoice_id", invoice.id);
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center my-6 text-gray-900">
        Invoice
      </h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Customer Details:
        </h3>
        <p className="text-gray-700">
          <strong>Customer Name:</strong> {name}
        </p>
        <p className="text-gray-700">
          <strong>Customer Email:</strong> {email}
        </p>
        <p className="text-gray-700">
          <strong>Date:</strong> {Date()}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Invoice Items:</h3>
        <table className="w-full table-auto mt-4 border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left px-4 py-2 font-semibold text-gray-700">
                Product Name
              </th>
              <th className="text-left px-4 py-2 font-semibold text-gray-700">
                Product Price
              </th>
              <th className="text-left px-4 py-2 font-semibold text-gray-700">
                Product Quantity
              </th>
            </tr>
          </thead>
          <tbody>
            {invoiceItemsWithProducts.map((item) => (
              <tr key={item?.id} className="border-b">
                <td className="px-4 py-2 text-gray-700">{item?.productName}</td>
                <td className="px-4 py-2 text-gray-700">
                  {formatPrice(item?.unitPrice)}
                </td>
                <td className="px-4 py-2 text-gray-700">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-800">Total Price:</h3>
        <p className="text-lg font-bold text-gray-900">
          {formatPrice(invoice?.total_net_amount)}
        </p>
      </div>

      {/* Confirm Button Section */}

      <ConfirmPay
        name={name || ""}
        total={parseFloat(invoice?.total_net_amount || 0)}
        email={email || ""}
        phone={phone || ""}
        products={invoiceItemsWithProducts}
        invoice_id={invoice.id || 0}
      />
    </div>
  );
};

export default Invoice;
