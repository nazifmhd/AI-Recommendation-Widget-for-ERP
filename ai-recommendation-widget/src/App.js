import React, { useState, useEffect } from "react";
import "./App.css";
import RecommendationWidget from "./components/RecommendationWidget";
import InventoryChart from "./components/InventoryChart";
import EditableInventory from "./components/EditableInventory";
import inventoryData from "./data/inventoryData";

// Helper: Export CSV
const exportCSV = (data) => {
  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));
  data.forEach(item => {
    const values = headers.map(header => `"${item[header]}"`);
    csvRows.push(values.join(","));
  });
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.href = url;
  a.download = "inventory_data.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// Helper: Load from localStorage or fallback
const getInitialInventory = () => {
  const saved = localStorage.getItem("inventoryData");
  return saved ? JSON.parse(saved) : [...inventoryData];
};

function App() {
  const [inventory, setInventory] = useState(getInitialInventory());

  // Dark mode theme toggle
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  // Sync inventory to localStorage
  useEffect(() => {
    localStorage.setItem("inventoryData", JSON.stringify(inventory));
  }, [inventory]);

  // Reset inventory to original
  const handleReset = () => {
    const resetData = [...inventoryData];
    setInventory(resetData);
    localStorage.removeItem("inventoryData");
  };

  return (
    <div className="App" style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={handleReset}>🔄 Reset Inventory</button>
        <button onClick={() => exportCSV(inventory)}>📤 Export to CSV</button>
        <button onClick={toggleTheme}>
          🌓 Switch to {theme === "light" ? "Dark" : "Light"} Mode
        </button>
      </div>
      <InventoryChart inventory={inventory} />
      <RecommendationWidget inventory={inventory} />
      <EditableInventory inventory={inventory} setInventory={setInventory} />
    </div>
  );
}

export default App;
