const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(process.env.POSGRE_URL);
const useBcrypt = require("sequelize-bcrypt");
const Job = require("./job");

const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Please enter a username" },
      },
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 20],
          msg: `maximum is 20 characters`,
        },
      },
      defaultValue: "last name",
      set(value) {
        this.setDataValue("lastName", value.trim());
      },
    },
    location: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 20],
          msg: `maximum is 20 characters`,
        },
      },
      defaultValue: "my city",
      set(value) {
        this.setDataValue("location", value.trim());
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: { msg: "Please enter a unique email" },
      allowNull: false,
      validate: {
        isEmail: {
          msg: "Please enter an email",
        },
        notEmpty: {
          msg: "Please enter an email",
        },
        len: {
          args: [6],
          msg: "Password requires at least 6 characters",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Please enter a password" },
      },
    },
  },
  { tableName: "user", modelName: "User" }
);
const syncTable = async () => {
  await User.sync({ alter: true });
};
useBcrypt(User, {
  field: "password",
  rounds: 12,
  compare: "authenticate",
});

// syncTable();
User.hasMany(Job);
Job.belongsTo(User);
module.exports = User;
