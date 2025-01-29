"use client";

// Custom JSON serialization function to handle BigInt
const json = (param: any): any => {
  return JSON.stringify(param, (key, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  });
};

const ButtonTotalCart = ({
  email,
  name,
  total,
  mobile,
  profile_id,
  invoice_details,
}) => {
  const handleCheckout = async (
    email,
    name,
    total,
    mobile,
    profile_id,
    invoice_details
  ) => {
    if (!email || !name || !total || !invoice_details || !profile_id) {
      alert("Missing required information.");
      return;
    }

    try {
      const requestData = {
        name,
        mobile,
        total_net_amount: total,
        total_gross_amount: total,
        profile_id: String(profile_id),
        created_by: 1,
        updated_by: 1,
        is_active: true,
        is_payment_gateway_scheduler_check: false,
        invoice_details,
      };

      const serializedRequest = json(requestData);

      const response = await fetch("/api/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: serializedRequest,
      });

      const data1 = await response.json();

      if (response.ok && data1.invoice) {
        console.log("Invoice Created:", data1.invoice);
        window.location.href = "/invoice";
      } else {
        console.error(
          "Error creating invoice:",
          data1.error || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <button
      onClick={() =>
        handleCheckout(email, name, total, mobile, profile_id, invoice_details)
      }
      className="btn bg-green-500 hover:bg-green-800 text-white p-2"
    >
      Check Out
    </button>
  );
};

export default ButtonTotalCart;
