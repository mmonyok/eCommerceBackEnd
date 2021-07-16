const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');


// Gets all products, including their categories and tags.
router.get('/', async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [{ model: Category }, { model: Tag, through: ProductTag, as: 'product_tags' }]
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Gets one product based on input id, including its category and tags.
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag, through: ProductTag, as: 'product_tags' }]
    });
    if (!productData) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Posts a new product.
router.post('/', async (req, res) => {
  try {
    let product = await Product.create(req.body);
    // If there are product tags, we need to create pairings to bulk create in the ProductTag model.
    if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      let productTagIds = await ProductTag.bulkCreate(productTagIdArr);
      res.status(200).json(productTagIds);
    } else {
      res.status(200).json(product);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// Updates an existing product based on input id.
router.put('/:id', async (req, res) => {
  try {
    let product = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
    // Finds all associated tags from the ProductTag model.
    let productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });
    if (req.body.tagIds) {
      // An array of current tag_ids.
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // Filters array to include new tag_ids.
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // Filters list of tag_ids to remove necessary ones.
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);
      // Updates new tag_ids and removes the ones needing to be removed.
      let updatedProductTags = await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
      res.status(200).json(updatedProductTags);
    } else {
      res.status(200).json(product);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// Deletes an existing product based on input id.
router.delete('/:id', async (req, res) => {
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!productData) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;