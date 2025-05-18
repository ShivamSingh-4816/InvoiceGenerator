import React, { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { toast } from "react-toastify";

const InventoryChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("name, quantity");

      if (error) {
        console.error("Error fetching product data:", error);
        toast.error("❌ Failed to load chart data.");
        return;
      }

      setChartData(data);
    };

    fetchChartData();
  }, []);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: "1.8rem",
          marginBottom: "16px",
          color: "#333",
          fontWeight: "bold",
        }}
      >
        📦 Product Inventory Overview
      </h2>

      {chartData.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            padding: "50px 0",
            color: "#888",
            fontSize: "1.1rem",
          }}
        >
          No data to display
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              interval={0}
              height={80}
              tick={{ fill: "#333", fontSize: 12 }}
            />
            <YAxis tick={{ fill: "#333", fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantity" fill="#8884d8" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default InventoryChart;

