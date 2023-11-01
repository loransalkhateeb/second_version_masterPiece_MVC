
const db = require(`../models/connect.js`);

const service_model = {
  getAllServices: async () => {
    try {
      return await db.query(`SELECT * from services`);
    } catch (error) {
      throw error;
    }
  },
};

module.exports = service_model;