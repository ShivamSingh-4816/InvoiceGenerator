import React, { useState, useEffect } from "react";
import { supabase } from "../supabase-client";
import './style.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InventoryForm = () => {
  const [userId, setUserId] = useState(null);
  const [scannedEAN, setScannedEAN] = useState("");
  const [product, setProduct] = useState({ name: "", price: "", quantity: "" });
  const [products, setProducts] = useState([]);
  const [scanErrorShown, setScanErrorShown] = useState(false); // ✅ Flag to prevent repeated error toast

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        toast.error("⚠ Please log in to add products.");
        return;
      }
      setUserId(session.user.id);
    };
    getSession();
  }, []);

  const startScanner = async () => {
    const html5QrCode = new Html5Qrcode("reader");

    setScanErrorShown(false); // ✅ Reset error shown flag on each scan

    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          setScannedEAN(decodedText);
          html5QrCode.stop();
          document.getElementById("reader").innerHTML = "";
          toast.success(`✅ Scanned: ${decodedText}`);
        },
        (err) => {
          if (!scanErrorShown) {
            error("❌ Scan error. Try again.");
            setScanErrorShown(true); // ✅ Prevent further error toasts
          }
        }
      );
    } catch (err) {
      console.error("Scanner init error", err);
      toast.error("❌ Scanner failed to start.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return toast.error("❌ User not logged in.");
    if (!scannedEAN) return toast.error("❌ Please scan a product first.");

    const newProduct = {
      ean: scannedEAN,
      name: product.name,
      price: Number(product.price),
      quantity: Number(product.quantity),
      user_id: userId,
    };

    const { error } = await supabase.from("products").insert([newProduct]);

    if (error) {
      console.error("Insert failed:", error);
      toast.error("❌ Could not save product.");
    } else {
      toast.success("✅ Product saved!");
      setProducts((prev) => [...prev, newProduct]);
      setProduct({ name: "", price: "", quantity: "" });
      setScannedEAN("");
    }
  };

  return (
    <div className="container">
      <h1 style={{ textAlign: "center" }}>📦 Inventory Management</h1>

      <div id="reader" style={{ width: "300px", margin: "auto" }}></div>
      <div className="btn-wrapper">
        <button id="scan-product" onClick={startScanner}>📷 Scan Product</button>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={product.quantity}
          onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
          required
        />
        <button type="submit">➕ Add Product</button>
      </form>

      <table style={{ width: "100%", marginTop: "20px" }} border="1">
        <thead>
          <tr>
            <th>EAN</th>
            <th>Name</th>
            <th>Price</th>
            <th>Qty</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item, idx) => (
            <tr key={idx}>
              <td>{item.ean}</td>
              <td>{item.name}</td>
              <td>₹{item.price}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default InventoryForm;
