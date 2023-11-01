
const db = require(`../models/connect.js`);

const UserModel = {
  getAllUsers: async () => {
    try {
      return await db.query(`SELECT * from users`);
    } catch (error) {
      throw error;
    }
  },
};

module.exports = UserModel;
