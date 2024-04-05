const { Model, DataTypes } = require("sequelize");

const { sequelize } = require("../utils/db");

class Sessions extends Model {}

Sessions.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      reference: { model: "users", key: "id" },
    },
    session: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "sessions",
  }
);

module.exports = Sessions;
