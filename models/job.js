const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.POSGRE_URL);

const Job = sequelize.define(
  "Job",
  {
    company: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Please enter a company" },
        len: {
          args: [0, 50],
          msg: "Maximum is 50 characters",
        },
      },
    },
    position: {
      type: DataTypes.STRING,

      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Please enter an position",
        },
        len: {
          args: [0, 50],
          msg: "Maximum is 50 characters",
        },
      },
    },
    status: {
      type: DataTypes.STRING,

      validate: {
        isIn: {
          args: [["pending", "interview", "declined"]],
          msg: `pending,interview,declined for status`,
        },
      },
      defaultValue: "pending",
    },
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Please enter an user Id",
        },
      },
      references: {
        model: "user",
        key: "id",
      },
    },
  },
  { tableName: "job", modelName: "Job" }
);
const syncTable = async () => {
  await Job.sync({ alter: true });
};

// syncTable();

module.exports = Job;
