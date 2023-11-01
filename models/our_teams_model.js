
const db = require(`../models/connect.js`);

const our_teams_model = {
  getAllTeams: async () => {
    try {
      return await db.query(`SELECT * from our_teams`);
    } catch (error) {
      throw error;
    }
  },
};

module.exports = our_teams_model;