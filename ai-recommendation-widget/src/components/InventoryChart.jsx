// src/components/InventoryChart.jsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const InventoryChart = ({ inventory }) => {
  return (
    <div style={{ width: "100%", height: 300, marginBottom: "40px" }}>
      <h3>📊 Inventory Stock vs Reorder Level</h3>
      <ResponsiveContainer>
        <BarChart data={inventory}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="item_name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="current_stock" fill="#8884d8" name="Current Stock" />
          <Bar dataKey="reorder_level" fill="#82ca9d" name="Reorder Level" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InventoryChart;
