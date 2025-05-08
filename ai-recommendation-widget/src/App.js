// Required dependencies: npm install react-toggle styled-components
import React, { useState, useEffect } from "react";
import Toggle from "react-toggle";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import "react-toggle/style.css";
import RecommendationWidget from "./components/RecommendationWidget";
import InventoryChart from "./components/InventoryChart";
import EditableInventory from "./components/EditableInventory";
import inventoryData from "./data/inventoryData";
import "./App.css";

// Themes
const lightTheme = {
  body: "#f4f4f4",
  text: "#222",
  buttonBg: "#007bff",
  buttonText: "#fff",
};

const darkTheme = {
  body: "#1e1e1e",
  text: "#f0f0f0",
  buttonBg: "#333",
  buttonText: "#f0f0f0",
};

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: background-color 0.3s ease, color 0.3s ease;
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

// Fade-in animation for the app
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

// CSV Export
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

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <GlobalStyle />
      <FadeInAppContainer className="App" style={{ padding: "20px" }}>
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
          <RecommendationWidget inventory={inventory} />
        </FadeInSection>
        <FadeInSection>
          <EditableInventory inventory={inventory} setInventory={setInventory} />
        </FadeInSection>
      </FadeInAppContainer>
    </ThemeProvider>
  );
}

export default App;
