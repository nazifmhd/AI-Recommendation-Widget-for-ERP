const generateRecommendations = (inventory) => {
    return inventory.map((item) => {
      let message = "";
      if (item.current_stock < item.reorder_level) {
        message = `⚠️ Restock ${item.item_name} — stock below reorder level.`;
      } else if (item.avg_daily_sales < 1) {
        message = `🐌 ${item.item_name} is slow-moving — consider discounting.`;
      } else if (item.avg_daily_sales > 5) {
        message = `🔥 ${item.item_name} is selling rapidly — adjust restock frequency.`;
      } else {
        message = `✅ ${item.item_name} is performing normally.`;
      }
      return { item: item.item_name, message };
    });
  };
  
  export default generateRecommendations;
  