const customerModel = require('../models/customers_model');

const customerController = {
  getAllCustomers: async (req, res) => {
    try {
      const customers = await customerModel.getAllCustomers();
      res.json(customers.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching customers');
    }
  },
  // Define other controller methods here...
};

module.exports = customerController;