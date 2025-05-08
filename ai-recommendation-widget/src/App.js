import React, { useState, useEffect } from "react";
import Toggle from "react-toggle";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import axios from "axios"; // ✅ NEW: To send request to your backend
import "react-toggle/style.css";
import RecommendationWidget from "./components/RecommendationWidget";
import InventoryChart from "./components/InventoryChart";
import EditableInventory from "./components/EditableInventory";
import inventoryData from "./data/inventoryData";
import "./App.css";

// Themes
const lightTheme = {
  body: "linear-gradient(to bottom right, #f8f9fa, #e9ecef)",
  text: "#222",
  buttonBg: "#007bff",
  buttonText: "#fff",
};

const darkTheme = {
  body: "linear-gradient(to bottom right, #121212, #1e1e1e)",
  text: "#f0f0f0",
  buttonBg: "#333",
  buttonText: "#f0f0f0",
};

const GlobalStyle = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.body};
    background-attachment: fixed;
    color: ${({ theme }) => theme.text};
    transition: color 0.3s ease;
    min-height: 100vh;
    margin: 0;
  }
  button {
    background-color: ${({ theme }) => theme.buttonBg};
    color: ${({ theme }) => theme.buttonText};
    border: none;
    border-radius: 6px;
    padding: 8px 12px;
    margin-right: 10px;
    cursor: pointer;
  }
`;

const fadeIn = `
  opacity: 0;
  animation: fadeIn 0.6s ease forwards;
`;

const fadeUp = `
  opacity: 0;
  transform: translateY(20px);
  animation: fadeUp 0.6s ease forwards;
  animation-delay: 0.3s;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  gap: 10px;
`;

const FadeInAppContainer = styled.div`
  text-align: center;
  transition: background-color 0.3s ease, color 0.3s ease;
  ${fadeIn}
`;

const FadeInSection = styled.div`
  ${fadeUp}
`;

// Add title styling
const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  ${fadeIn}
`;

// CSV Export
// ...existing code...
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

const getInitialInventory = () => {
  const saved = localStorage.getItem("inventoryData");
  return saved ? JSON.parse(saved) : [...inventoryData];
};

function App() {
  const [inventory, setInventory] = useState(getInitialInventory());
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("inventoryData", JSON.stringify(inventory));
  }, [inventory]);

  const handleReset = () => {
    const resetData = [...inventoryData];
    setInventory(resetData);
    localStorage.removeItem("inventoryData");
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  // ✅ NEW: Function to call backend GPT API
  const getGPTRecommendation = async (prompt) => {
    try {
      const res = await axios.post("http://localhost:5000/api/gpt", { prompt });
      return res.data.message;
    } catch (err) {
      console.error("GPT error:", err);
      return "Sorry, I couldn't generate a recommendation.";
    }
  };

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <GlobalStyle />
      <FadeInAppContainer className="App" style={{ padding: "20px" }}>

      <PageTitle>AI Recommendation Widget for ERP</PageTitle>
      
        <ToggleContainer>
          <button onClick={handleReset}>🔄 Reset Inventory</button>
          <button onClick={() => exportCSV(inventory)}>📤 Export to CSV</button>
          <label>
            <Toggle
              defaultChecked={theme === "dark"}
              icons={{ checked: "🌙", unchecked: "☀️" }}
              onChange={toggleTheme}
            />
            <span style={{ marginLeft: "8px" }}>
              {theme === "light" ? "Light" : "Dark"} Mode
            </span>
          </label>
        </ToggleContainer>

        <FadeInSection>
          <InventoryChart inventory={inventory} />
        </FadeInSection>
        <FadeInSection>
          {/* ✅ Pass GPT handler as prop */}
          <RecommendationWidget inventory={inventory} getRecommendation={getGPTRecommendation} />
        </FadeInSection>
        <FadeInSection>
          <EditableInventory inventory={inventory} setInventory={setInventory} />
        </FadeInSection>
      </FadeInAppContainer>
    </ThemeProvider>
  );
}

export default App;
