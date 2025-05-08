// src/components/RecommendationWidget.jsx
import React from "react";

const generateRecommendations = (inventory) => {
  const today = new Date();
  const recs = [];

  inventory.forEach((item) => {
    const { item_name, current_stock, reorder_level, avg_daily_sales, last_restocked_date } = item;

    if (current_stock < reorder_level) {
      recs.push(`📦 Restock ${item_name} — stock below reorder level.`);
    }

    if (avg_daily_sales < 1 && current_stock > reorder_level * 1.5) {
      recs.push(`🐌 ${item_name} is slow-moving — consider discounting.`);
    }

    if (avg_daily_sales >= 5 && current_stock < reorder_level * 1.2) {
      recs.push(`🔥 ${item_name} is selling fast — consider adjusting restock frequency.`);
    }

    // Optional: date-based insight
    if (last_restocked_date) {
      const daysAgo = (today - new Date(last_restocked_date)) / (1000 * 60 * 60 * 24);
      if (daysAgo > 30 && current_stock < reorder_level) {
        recs.push(`🕓 ${item_name} hasn’t been restocked in ${Math.floor(daysAgo)} days — time to review.`);
      }
    }
  });

  return recs;
};

const RecommendationWidget = ({ inventory }) => {
  const recommendations = generateRecommendations(inventory);

  return (
    <div>
      <h3>💡 AI Recommendations</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {recommendations.map((rec, index) => (
          <li key={index} style={{ marginBottom: "8px", background: "#f4f4f4", padding: "8px", borderRadius: "6px" }}>
            {rec}
          </li>
        ))}
        {recommendations.length === 0 && <li>✅ No actions needed — inventory is healthy!</li>}
      </ul>
    </div>
  );
};

export default RecommendationWidget;
