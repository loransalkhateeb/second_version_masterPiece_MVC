
const db = require(`../models/connect.js`);

const customer_Model = {
  getAllCustomers: async () => {
    try {
      return await db.query(`SELECT * from customer`);
    } catch (error) {
      throw error;
    }
  },
};

module.exports = customer_Model;