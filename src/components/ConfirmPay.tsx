"use client";
import React from "react";
import Swal from "sweetalert2";
const json = (param: any): any => {
  return JSON.stringify(param, (key, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  });
};

interface confirmPayProps {
  name: string;
  total: number;
  email: string;
  products: any[];
}

const ConfirmPay = ({ name, total, email, products }: confirmPayProps) => {
  console.log("confirmpay", name, total, email, products);
  const handleSendInvoice = async () => {
    if (!email || !name || !total || !products) {
      alert("Missing required information.");
      return;
    }

    try {
      const filteredProducts = products.map((product) => ({
        productName: product.productName,
        quantity: product.quantity,
        price: product.unitPrice,
      }));
      const requestData = {
        name: name,
        total: total,
        email: email,
        products: filteredProducts,
      };

      //   const serializedRequest = json(requestData);
      const response = await fetch("/api/sendmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      const data1 = await response.json();
      console.log("data1",data1);
      if (response.ok && data1.message) {
        console.log("Mail send:");
        Swal.fire({
          title: "Good job!",
          text: "Invoice Sent!",
          icon: "success",
        });
        window.location.href = "/";
      } else {
        console.error("Error sendmail:", data1.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div>
      <button
        onClick={handleSendInvoice}
        className="btn bg-green-500 hover:bg-green-800 text-white p-2"
      >
        ConfirmPay
      </button>
    </div>
  );
};

export default ConfirmPay;
