// src/components/RecommendationWidget.jsx
import React from "react";
import "./RecommendationWidget.css";

const generateRecommendations = (inventory) => {
  const today = new Date();
  const recs = [];

  inventory.forEach((item) => {
    const { item_name, current_stock, reorder_level, avg_daily_sales, last_restocked_date } = item;

    // Critical recommendations first (low stock)
    if (current_stock < reorder_level) {
      recs.push(`📦 Restock ${item_name} — stock below reorder level (${current_stock}/${reorder_level}).`);
    }

    // Days of inventory remaining calculation
    const daysRemaining = current_stock / (avg_daily_sales || 0.1);
    if (daysRemaining < 5 && current_stock > 0) {
      recs.push(`⚠️ ${item_name} will run out in approximately ${Math.round(daysRemaining)} days.`);
    }

    // Slow-moving items
    if (avg_daily_sales < 1 && current_stock > reorder_level * 1.5) {
      recs.push(`🐌 ${item_name} is slow-moving — consider discounting.`);
    }

    // Fast-moving items
    if (avg_daily_sales > 5 && current_stock < reorder_level * 1.2) {
      recs.push(`🔥 ${item_name} is selling fast — consider adjusting restock frequency.`);
    }

    // Date-based insight
    if (last_restocked_date) {
      const daysAgo = Math.floor((today - new Date(last_restocked_date)) / (1000 * 60 * 60 * 24));
      if (daysAgo > 30 && current_stock < reorder_level * 1.2) {
        recs.push(`🕓 ${item_name} hasn't been restocked in ${daysAgo} days — time to review.`);
      }
    }
    
    // Special recommendation for Paper A4 (high volume item)
    if (item_name === "Paper A4" && avg_daily_sales > 8) {
      recs.push(`📄 ${item_name} is a high-volume item — consider bulk purchase discounts.`);
    }
  });

  return recs;
};

const RecommendationWidget = ({ inventory }) => {
  const recommendations = generateRecommendations(inventory);

  return (
    <div className="widget-container">
      <h3>💡 AI Recommendations</h3>
      <ul className="recommendation-list">
        {recommendations.map((rec, index) => (
          <li key={index} className="recommendation-item">
            {rec}
          </li>
        ))}
        {recommendations.length === 0 && (
          <li className="recommendation-item">✅ No actions needed — inventory is healthy!</li>
        )}
      </ul>
    </div>
  );
};

export default RecommendationWidget;