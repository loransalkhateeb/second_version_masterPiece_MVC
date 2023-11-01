
const db = require(`../models/connect.js`);

const offers_Model = {
  getalloffers: async () => {
    try {
      return await db.query(`SELECT * from offers`);
    } catch (error) {
      throw error;
    }
  },
};

module.exports = offers_Model;