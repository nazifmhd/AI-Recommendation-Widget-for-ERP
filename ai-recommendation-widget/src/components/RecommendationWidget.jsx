// src/components/RecommendationWidget.jsx
import React from "react";
import "./RecommendationWidget.css";

const classifyRecommendation = (message, severity = "info") => ({ message, severity });

const generateRecommendations = (inventory) => {
  const today = new Date();
  const recs = [];

  inventory.forEach((item) => {
    const {
      item_name,
      current_stock,
      reorder_level,
      avg_daily_sales,
      last_restocked_date,
    } = item;

    // Critical: Stock below reorder level
    if (current_stock < reorder_level) {
      recs.push(
        classifyRecommendation(
          `📦 Restock ${item_name} — stock below reorder level (${current_stock}/${reorder_level}).`,
          "critical"
        )
      );
    }

    // Warning: Item may run out soon
    const daysRemaining = current_stock / (avg_daily_sales || 0.1);
    if (daysRemaining < 5 && current_stock > 0) {
      recs.push(
        classifyRecommendation(
          `⚠️ ${item_name} will run out in approx. ${Math.round(daysRemaining)} days.`,
          "warning"
        )
      );
    }

    // Info: Slow-moving item
    if (avg_daily_sales < 1 && current_stock > reorder_level * 1.5) {
      recs.push(
        classifyRecommendation(
          `🐌 ${item_name} is slow-moving — consider discounting.`,
          "info"
        )
      );
    }

    // Warning: Fast-selling item with low stock
    if (avg_daily_sales > 5 && current_stock < reorder_level * 1.2) {
      recs.push(
        classifyRecommendation(
          `🔥 ${item_name} is selling fast — review restocking frequency.`,
          "warning"
        )
      );
    }

    // Info: Not restocked in a long time
    if (last_restocked_date) {
      const daysAgo =
        Math.floor((today - new Date(last_restocked_date)) / (1000 * 60 * 60 * 24));
      if (daysAgo > 30 && current_stock < reorder_level * 1.2) {
        recs.push(
          classifyRecommendation(
            `🕓 ${item_name} hasn't been restocked in ${daysAgo} days — consider review.`,
            "info"
          )
        );
      }
    }

    // Info: Special case for Paper A4
    if (item_name === "Paper A4" && avg_daily_sales > 8) {
      recs.push(
        classifyRecommendation(
          `📄 ${item_name} is high-volume — bulk purchase discounts may help.`,
          "info"
        )
      );
    }
  });

  // Sort by severity: critical > warning > info
  const severityOrder = { critical: 0, warning: 1, info: 2 };
  recs.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return recs;
};

const RecommendationWidget = ({ inventory }) => {
  const recommendations = generateRecommendations(inventory);

  return (
    <div className="widget-container">
      <h3>💡 AI Recommendations</h3>
      <ul className="recommendation-list">
        {recommendations.length > 0 ? (
          recommendations.map((rec, index) => (
            <li key={index} className={`recommendation-item ${rec.severity}`}>
              {rec.message}
            </li>
          ))
        ) : (
          <li className="recommendation-item">✅ No actions needed — inventory is healthy!</li>
        )}
      </ul>
    </div>
  );
};

export default RecommendationWidget;
