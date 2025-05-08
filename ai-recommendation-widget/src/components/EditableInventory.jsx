// src/components/EditableInventory.jsx
import React from "react";

const EditableInventory = ({ inventory, setInventory }) => {
  const handleChange = (index, field, value) => {
    const updated = [...inventory];
    updated[index][field] = field === "item_name" ? value : Number(value);
    setInventory(updated);
  };

  return (
    <div style={{ marginTop: "40px", overflowX: "auto" }}>
      <h3>🛠️ Editable Inventory</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
        <thead style={{ backgroundColor: "#f0f0f0" }}>
          <tr>
            <th>Item Name</th>
            <th>Current Stock</th>
            <th>Reorder Level</th>
            <th>Avg. Daily Sales</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item, index) => (
            <tr key={index}>
              {["item_name", "current_stock", "reorder_level", "avg_daily_sales"].map((field) => (
                <td key={field}>
                  <input
                    type={field === "item_name" ? "text" : "number"}
                    value={item[field]}
                    onChange={(e) => handleChange(index, field, e.target.value)}
                    aria-label={`${field} for ${item.item_name}`}
                    style={{
                      width: "100%",
                      padding: "6px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EditableInventory;
