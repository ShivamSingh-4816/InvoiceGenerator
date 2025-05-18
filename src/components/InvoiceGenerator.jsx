import React, { useState, useEffect } from "react";
import { supabase } from "../supabase-client";
import { sendEmail } from "../emailClient";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "../styles.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const customPrompt = async (message) => {
  return new Promise((resolve) => {
    const inputBox = document.createElement("div");
    inputBox.style.position = "fixed";
    inputBox.style.top = "50%";
    inputBox.style.left = "50%";
    inputBox.style.transform = "translate(-50%, -50%)";
    inputBox.style.background = " rgba(0,0,0,0.3)";
    inputBox.style.padding = "20px";
    inputBox.style.borderRadius = "10px";
    inputBox.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
    inputBox.style.zIndex = "9999";
    inputBox.style.minWidth = "300px";

    const label = document.createElement("label");
    label.innerText = message;
    label.style.display = "block";
    label.style.marginBottom = "10px";
    label.style.fontWeight = "bold";

    const input = document.createElement("input");
    input.style.padding = "10px";
    input.style.width = "100%";
    input.style.marginBottom = "15px";
    input.style.border = "1px solid #ccc";
    input.style.borderRadius = "5px";

    const submit = document.createElement("button");
    submit.innerText = "Submit";
    submit.style.padding = "10px 20px";
    submit.style.background = "#4CAF50";
    submit.style.color = "white";
    submit.style.border = "none";
    submit.style.cursor = "pointer";
    submit.style.borderRadius = "5px";
    submit.style.fontWeight = "bold";

    submit.onclick = () => {
      document.body.removeChild(inputBox);
      resolve(input.value.trim());
    };

    inputBox.appendChild(label);
    inputBox.appendChild(input);
    inputBox.appendChild(submit);
    document.body.appendChild(inputBox);
    input.focus();
  });
};

const InvoiceGenerator = () => {
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(false);
  const [userId, setUserId] = useState(null);
  const [scanErrorShown, setScanErrorShown] = useState(false); // ✅ For one-time error display

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const uid = data?.session?.user?.id;
      if (!uid) {
        toast.error("⚠ Please log in.");
        return;
      }
      setUserId(uid);
    });
  }, []);

  const setCustomer = async () => {
    const name = await customPrompt("Enter customer name:");
    if (!name) return toast.error("❌ Customer name is required.");
    setCustomerName(name);
    toast.success("✅ Customer name set.");
  };

  const startScanner = async () => {
    if (!customerName) return toast.warning("📝 Enter customer name first.");

    const html5QrCode = new Html5Qrcode("reader");

    setScanErrorShown(false); // ✅ Reset flag

    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          await html5QrCode.stop();
          document.getElementById("reader").innerHTML = "";
          setScanning(false);
          fetchProduct(decodedText);
        },
        (err) => {
          if (!scanErrorShown) {
            error("❌ Scan error. Try again.");
            setScanErrorShown(true);
          }
        }
      );
      setScanning(true);
    } catch (err) {
      toast.error("❌ Failed to start scanner.");
    }
  };

  const fetchProduct = async (ean) => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("ean", ean)
      .eq("user_id", userId)
      .single();

    if (error || !data) return toast.error("❌ Product not found or not yours.");

    const qty = parseInt(await customPrompt(`Qty for ${data.name} (Stock: ${data.quantity})`), 10);
    if (!qty || qty < 1 || qty > data.quantity)
      return toast.warning("❌ Invalid quantity");

    const itemTotal = qty * data.price;

    const item = {
      ean: data.ean,
      name: data.name,
      price: data.price,
      quantity: qty,
      itemTotal,
    };

    setInvoiceItems((prev) => [...prev, item]);
    setTotalAmount((prev) => prev + itemTotal);

    await supabase
      .from("products")
      .update({ quantity: data.quantity - qty })
      .eq("ean", ean)
      .eq("user_id", userId);

    toast.success("✅ Product added");
  };

  const handleManualAdd = async () => {
    if (!customerName) return toast.warning("📝 Enter customer name first.");
    const name = await customPrompt("Enter product name:");
    const price = parseFloat(await customPrompt("Enter price (₹):"));
    const quantity = parseInt(await customPrompt("Enter quantity:"), 10);

    if (!name || isNaN(price) || isNaN(quantity) || price <= 0 || quantity <= 0) {
      toast.error("❌ Invalid input");
      return;
    }

    const itemTotal = price * quantity;
    const item = { ean: "0000", name, price, quantity, itemTotal };

    setInvoiceItems((prev) => [...prev, item]);
    setTotalAmount((prev) => prev + itemTotal);
    toast.success("✅ Manual item added");
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const invoiceNo = Math.floor(100000 + Math.random() * 900000);
    const dateStr = new Date().toLocaleString();

    doc.setFontSize(20).text(" My Retail Shop", 14, 20);
    doc.setFontSize(12);
    doc.text(`Invoice #: ${invoiceNo}`, 14, 30);
    doc.text(`Date: ${dateStr}`, 14, 36);
    doc.text(`Billed To: ${customerName}`, 14, 42);

    autoTable(doc, {
      startY: 50,
      head: [["EAN", "Name", "Price", "Qty", "Total"]],
      body: invoiceItems.map((item) => [
        item.ean,
        item.name,
        item.price.toFixed(2),
        item.quantity,
        item.itemTotal.toFixed(2),
      ]),
      theme: "grid",
      headStyles: { fillColor: [0, 123, 255], textColor: 255 },
      styles: { halign: "center" },
    });

    const y = doc.lastAutoTable.finalY + 10;
    doc.setDrawColor(0, 0, 0);
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(14, y, 180, 12, 3, 3, "FD");
    doc.setTextColor(33, 33, 33);
    doc.setFontSize(14).text(`Grand Total: ${totalAmount.toFixed(2)}`, 16, y + 8);

    doc.save(`Invoice_${invoiceNo}.pdf`);
    toast.info("📄 Invoice PDF downloaded");
  };

  const handleDone = async () => {
    const email = await customPrompt("Enter email to send invoice:");
    if (!email) return;
    setDone(true);
    generatePDF();

    const text = invoiceItems
      .map((item) => `• ${item.name}: Qty ${item.quantity} × ₹${item.price} = ₹${item.itemTotal}`)
      .join("\n");

    await sendEmail(email, customerName, text, totalAmount);
    toast.success(`📧 Invoice sent to ${email}`);
  };

  return (
    <div className="container">
      <h1>🧾 Invoice Generator</h1>

      <button onClick={setCustomer} className="btn" id="scan-btn">
        {customerName ? ` Customer: ${customerName}` : "Set Customer Name"}
      </button>

      <div id="reader" style={{ width: "300px", margin: "20px auto" }}></div>

      <div className="btn-wrapper">
        <button onClick={startScanner} id="scan-btn">Scan Product</button>
        <button onClick={handleManualAdd} id="manual-btn">Add Manually</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>EAN</th>
            <th>Name</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {invoiceItems.map((item, idx) => (
            <tr key={idx}>
              <td>{item.ean}</td>
              <td>{item.name}</td>
              <td>₹{item.price}</td>
              <td>{item.quantity}</td>
              <td>₹{item.itemTotal}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {invoiceItems.length > 0 && !done && (
        <button id="done-btn" onClick={handleDone}>✅ Done</button>
      )}

      {done && (
        <h2 style={{ textAlign: "center", marginTop: "20px" }}>
          Grand Total: {totalAmount.toFixed(2)}
        </h2>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default InvoiceGenerator;
