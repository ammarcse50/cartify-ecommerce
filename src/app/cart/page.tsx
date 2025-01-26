import CartEntry from "../../components/CartEntry";
import { getCart } from "./cart";
import { formatPrice } from "../lib/format";
import { setProductQuantity } from "./action";

export default async function CartPage() {
  const cart = await getCart();

  console.log("this is cart", cart);
  // nodemailer welcome message
  // const transporter = nodemailer.createTransport({
  //   service: "gmail", // or another email service
  //   auth: {
  //     user: "ammaraslam7164@gmail.com",
  //     pass: "wefopxlsdumlohpx",
  //   },
  // });

  // Send welcome email function
  // const sendWelcomeEmail = (userEmail, userName, total) => {
  //   const mailOptions = {
  //     from: "ammaraslam7164@gmail.com", // sender's emai
  //     to: userEmail, // receiver's email
  //     subject: "Welcome to Our Website!",
  //     html: `
  //       <h2>Hello ${userName},</h2>
  //        <h3>Your Total Amount: ${formatPrice(total)}</h2>
  //       <p>Thanks for happy shopping!</p>

  //       <p>Feel free to explore and let us know if you need any help.</p>
  //       <p>Best regards,<br/>Safara Academy</p>
  //     `,
  //   };

    // Send the email
  //   transporter.sendMail(mailOptions, (error, info) => {
  //     if (error) {
  //       console.log("Error sending email:", error);
  //     } else {
  //       console.log("Email sent: " + info.response);
  //     }
  //   });
  // };
  const handleCheckout = (email, name, total) => {
    if (!email || !name || !total) {
      return;
    }

    // sendWelcomeEmail(email, name, total);
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold ">ShoppingCart</h1>
      {cart?.items.map((cartItem) => (
        <CartEntry
          setProductQuantity={setProductQuantity}
          cartItem={cartItem}
          key={cartItem.productId}
        />
      ))}
      {!cart?.items.length && <p>your cart is empty</p>}
      <div className="flex flex-col items-end">
        <p className="mb-3 font-bold">
          Total: {formatPrice(cart?.subtotal || 0)}
        </p>
        <button
          className="btn bg-green-500 hover:bg-green-800 text-white p-2"
        
        >
          Check Out
        </button>
      </div>
    </div>
  );
}
