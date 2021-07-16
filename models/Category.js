// Obtains necessary elements from modules and files.
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection.js');

// This table will hold all of the category types.
class Category extends Model { }

// Sets up fields and rules for the Category model.
Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'category',
  }
);

// Exporting the new model for use elsewhere.
module.exports = Category;