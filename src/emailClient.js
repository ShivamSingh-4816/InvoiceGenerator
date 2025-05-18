import emailjs from "emailjs-com";
import {
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY,
} from "./.envemail"; // Adjust path if needed

export const sendEmail = async (toEmail, customerName, productList, grandTotal) => {
  const templateParams = {
    to_email: toEmail,
    customer_name: customerName,
    items: productList,
    total: `₹${grandTotal.toFixed(2)}`,
  };

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );
    alert("📧 Invoice sent to email!");
  } catch (err) {
    console.error("❌ Email error:", err);
    alert("❌ Failed to send invoice.");
  }
};
