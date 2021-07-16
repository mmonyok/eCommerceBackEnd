// Obtains necessary elements from modules and files.
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection.js');

// This table will hold all of the tag types.
class Tag extends Model { }

// Sets up fields and rules for the Tag model.
Tag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    tag_name: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'tag',
  }
);

// Exporting the new model for use elsewhere.
module.exports = Tag;