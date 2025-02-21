const detailsTableModel = require('../models/detailsTableModel.js');

const getDetailsTable = async (req, res) => {
  const { productId } = req.params;
  try {
    const details = await detailsTableModel.getDetailsForProduct(productId);
    if (!details) {
      return res.status(404).json({ error: 'No details found for this product' });
    }
    res.json(details);
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getDetailsTable };
