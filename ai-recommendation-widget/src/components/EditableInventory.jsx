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
      <h3 style={{ color: "#2c3e50", marginBottom: "15px" }}>🛠️ Editable Inventory</h3>
      <table style={{ 
        width: "100%", 
        borderCollapse: "separate", 
        borderSpacing: "0",
        minWidth: "600px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        borderRadius: "8px",
        overflow: "hidden"
      }}>
        <thead>
          <tr style={{ background: "linear-gradient(to right, #3498db, #2980b9)" }}>
            <th style={{ color: "white", padding: "12px 15px", textAlign: "left", fontWeight: "600" }}>Item Name</th>
            <th style={{ color: "white", padding: "12px 15px", textAlign: "left", fontWeight: "600" }}>Current Stock</th>
            <th style={{ color: "white", padding: "12px 15px", textAlign: "left", fontWeight: "600" }}>Reorder Level</th>
            <th style={{ color: "white", padding: "12px 15px", textAlign: "left", fontWeight: "600" }}>Avg. Daily Sales</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item, index) => (
            <tr key={index} style={{ 
              backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
              transition: "background-color 0.2s"
            }}
            onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = "#f0f7ff"}}
            onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#f9f9f9" : "white"}}
            >
              {["item_name", "current_stock", "reorder_level", "avg_daily_sales"].map((field) => (
                <td key={field} style={{ padding: "10px 15px", borderBottom: "1px solid #eaeaea" }}>
                  <input
                    type={field === "item_name" ? "text" : "number"}
                    value={item[field]}
                    onChange={(e) => handleChange(index, field, e.target.value)}
                    aria-label={`${field} for ${item.item_name}`}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      fontSize: "14px",
                      transition: "border 0.2s, box-shadow 0.2s",
                      outline: "none",
                      ":focus": {
                        borderColor: "#3498db",
                        boxShadow: "0 0 0 3px rgba(52, 152, 219, 0.2)"
                      }
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