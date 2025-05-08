// src/components/InventoryChart.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";

const InventoryChart = ({ inventory }) => {
  return (
    <div style={{ width: "100%", height: 350, marginBottom: "40px" }}>
      <h3>📊 Inventory Stock vs Reorder Level</h3>
      <ResponsiveContainer>
        <BarChart data={inventory} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="item_name" angle={-20} textAnchor="end" interval={0} />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="current_stock" fill="#4CAF50" name="Current Stock">
            <LabelList dataKey="current_stock" position="top" />
          </Bar>
          <Bar dataKey="reorder_level" fill="#F44336" name="Reorder Level">
            <LabelList dataKey="reorder_level" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InventoryChart;
