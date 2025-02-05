"use client";
import React from "react";
import Swal from "sweetalert2";

interface ConfirmPayProps {
  name: string;
  total: number;
  email: string;
  phone: string;
  invoice_id: any;
  products: any[];
}

// Serialize BigInt to String
const serializeBigInt = (param: any): any => {
  return JSON.stringify(param, (key, value) =>
    typeof value === "bigint" ? value.toString() : value
  );
};

const ConfirmPay = ({
  name,
  total,
  email,
  products,
  phone,
  invoice_id: invoice_id,
}: ConfirmPayProps) => {
  const formatPhoneNumber = (phone: string) => {
    let formattedPhone = phone.replace(/\D/g, ""); // Remove non-numeric characters
    if (!formattedPhone.startsWith("880")) {
      formattedPhone = "880" + formattedPhone; // Add 880 prefix if not present
    }
    return formattedPhone; // Return the phone number without the + sign
  };

  const handleSendInvoice = async () => {
    if (!email || !name || !total || !products || products.length === 0) {
      Swal.fire({
        title: "Missing Information",
        text: "Please make sure all fields are filled out.",
        icon: "error",
        confirmButtonText: "Okay",
      });
      return;
    }

    const filteredProducts = products.map((product) => ({
      productName: product.productName,
      quantity: product.quantity,
      price: product.unitPrice,
    }));

    const requestData = {
      name,
      total,
      email,
      products: filteredProducts,
    };
    const request_Email_failed_Data = {
      name,
      total,
      email,
      invoice_id: invoice_id,
    };

    // Serialize request data before sending to handle BigInt
    const serializedRequestData = JSON.parse(serializeBigInt(requestData));
    const serializedFailedRequestData = JSON.parse(
      serializeBigInt(request_Email_failed_Data)
    );

    Swal.fire({
      title: "Are you sure you want to send the invoice?",
      text: "This will send the invoice to the provided email.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, send it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch("/api/sendmail", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(serializedRequestData),
          });

          const data = await response.json();
          if (response.ok && data.message) {
            const formattedPhone = formatPhoneNumber(phone);

            const response_SMS = await fetch(
              `${process.env.NEXT_PUBLIC_sms_base_url}?sms_receiver=${formattedPhone}&sms_text=Your order is placed. Paid amount: ${total} BDT. Thank you for your purchase!&user_id=${process.env.NEXT_PUBLIC_SMS_USER_ID}&user_password=${process.env.NEXT_PUBLIC_SMS_USER_PASSWORD}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            const data_sms = await response_SMS.json();

            if (data_sms.error) {
              Swal.fire({
                title: "Error",
                text: "Failed to send SMS notification.",
                icon: "error",
                confirmButtonText: "Try Again",
              });
            }

            Swal.fire({
              title: "Success!",
              text: "The invoice has been sent successfully.",
              icon: "success",
              confirmButtonText: "Okay",
            }).then(() => {
              window.location.href = "/";
            });
          } else {
            console.log("request_failed_data", name, total, email, invoice_id);
            const response_failed_data = await fetch(
              "/api/failedEmailSchedule",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(serializedFailedRequestData),
              }
            );

            const send_failed_data = await response_failed_data.json();

            if (response_failed_data && send_failed_data.message) {
              Swal.fire({
                title: "Success!",
                text: "The invoice Reschedule successfully.",
                icon: "success",
                confirmButtonText: "Okay",
              });
            }

            Swal.fire({
              title: "Invoice Error",
              text:
                data.error || "Something went wrong while sending the invoice.",
              icon: "error",
              confirmButtonText: "Try Again",
            });
          }
        } catch (error) {
          console.log(error);
        
        }
      } else {
        Swal.fire("Cancelled", "The invoice was not sent.", "info");
      }
    });
  };

  return (
    <div>
      <button
        onClick={handleSendInvoice}
        className="btn bg-green-500 hover:bg-green-800 text-white p-2"
      >
        Confirm Pay
      </button>
    </div>
  );
};

export default ConfirmPay;
