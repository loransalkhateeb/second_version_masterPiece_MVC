
const db = require(`../models/connect.js`);

const name_cleanning_model = {
  getAllcleanning: async () => {
    try {
      return await db.query(`SELECT * from name_cleaning`);
    } catch (error) {
      throw error;
    }
  },
};

module.exports = name_cleanning_model;