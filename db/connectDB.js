const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.POSGRE_URL);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected To DB");
  } catch (error) {
    console.log(`can't connect to DB`);
  }
};

module.exports = { connectDB, sequelize };
