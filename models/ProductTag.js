// Obtains necessary elements from modules and files.
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// This table will hold all of the product-tag relationship keys.
class ProductTag extends Model { }

// Sets up fields and rules for the ProductTag model.
ProductTag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'product',
        key: 'id',
      },
    },
    tag_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tag',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_tag',
  }
);

// Exporting the new model for use elsewhere.
module.exports = ProductTag;