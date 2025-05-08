import React, { useState, useEffect, useCallback } from "react";
import "./RecommendationWidget.css";

const classifyRecommendation = (message, severity = "info") => ({ message, severity });

const RecommendationWidget = ({ inventory, getRecommendation }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Memoize the generateRecommendations function to avoid unnecessary re-renders
  const generateRecommendations = useCallback(async () => {
    setLoading(true);

    // GPT-based recommendation generation
    const gptPrompt = "Provide inventory recommendations based on the following data: " + JSON.stringify(inventory);
    const gptRecommendations = await getRecommendation(gptPrompt);
    const gptRecs = gptRecommendations.split("\n").map((rec) => classifyRecommendation(rec, "info"));

    // Inventory-based recommendation generation
    const today = new Date();
    const inventoryRecs = [];

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
        inventoryRecs.push(
          classifyRecommendation(
            `📦 Restock ${item_name} — stock below reorder level (${current_stock}/${reorder_level}).`,
            "critical"
          )
        );
      }

      // Warning: Item may run out soon
      const daysRemaining = current_stock / (avg_daily_sales || 0.1);
      if (daysRemaining < 5 && current_stock > 0) {
        inventoryRecs.push(
          classifyRecommendation(
            `⚠️ ${item_name} will run out in approx. ${Math.round(daysRemaining)} days.`,
            "warning"
          )
        );
      }

      // Info: Slow-moving item
      if (avg_daily_sales < 1 && current_stock > reorder_level * 1.5) {
        inventoryRecs.push(
          classifyRecommendation(
            `🐌 ${item_name} is slow-moving — consider discounting.`,
            "info"
          )
        );
      }

      // Warning: Fast-selling item with low stock
      if (avg_daily_sales > 5 && current_stock < reorder_level * 1.2) {
        inventoryRecs.push(
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
          inventoryRecs.push(
            classifyRecommendation(
              `🕓 ${item_name} hasn't been restocked in ${daysAgo} days — consider review.`,
              "info"
            )
          );
        }
      }

      // Info: Special case for Paper A4
      if (item_name === "Paper A4" && avg_daily_sales > 8) {
        inventoryRecs.push(
          classifyRecommendation(
            `📄 ${item_name} is high-volume — bulk purchase discounts may help.`,
            "info"
          )
        );
      }
    });

    // Combine GPT and inventory-based recommendations
    const allRecs = [...gptRecs, ...inventoryRecs];

    // Sort by severity: critical > warning > info
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    allRecs.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    setRecommendations(allRecs);
    setLoading(false);
  }, [inventory, getRecommendation]); // Memoize function, depend on inventory and getRecommendation

  useEffect(() => {
    generateRecommendations(); // Call on mount and when inventory changes
  }, [inventory, generateRecommendations]); // Only re-run when inventory changes

  return (
    <div className="widget-container">
      <h3>💡 AI Recommendations</h3>
      {loading ? (
        <p>Loading recommendations...</p>
      ) : (
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
      )}
    </div>
  );
};

export default RecommendationWidget;
