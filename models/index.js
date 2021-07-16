// Imports the models.
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Sets up association between the Category and Product models.
Category.hasMany(Product, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE',
});

// Sets up association between the Product and Category models.
Product.belongsTo(Category, {
  foreignKey: 'category_id',
});

// Sets up association between the Product and Tag models where they use the ProductTag model for sharing keys.
Product.belongsToMany(Tag, {
  through: {
    model: ProductTag,
    unique: false
  },
  as: 'product_tags'
});

// Sets up association between the Tag and Product models where they use the ProductTag model for sharing keys.
Tag.belongsToMany(Product, {
  through: {
    model: ProductTag,
    unique: false
  },
  as: 'tag_products'
});

// Exporting all of the associations for use elsewhere.
module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
