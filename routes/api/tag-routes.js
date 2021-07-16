const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// Gets all tags, including their associated products.
router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product, through: ProductTag, as: 'tag_products' }]
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Gets one tag based on input id, including its associated products.
router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag, as: 'tag_products' }]
    });
    if (!tagData) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Posts a new tag.
router.post('/', async (req, res) => {
  try {
    let tag = await Tag.create(req.body);
    // If there are tagged products, we need to create pairings to bulk create in the ProductTag model.
    if (req.body.productIds.length) {
      const tagProductIdArr = req.body.productIds.map((product_id) => {
        return {
          tag_id: tag.id,
          product_id,
        };
      });
      let tagProductIds = await ProductTag.bulkCreate(tagProductIdArr);
      res.status(200).json(tagProductIds);
    } else {
      res.status(200).json(tag);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// Updates an existing tag based on input id.
router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    let tag = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    // Finds all associated products from the ProductTag model.
    let tagProducts = await ProductTag.findAll({ where: { tag_id: req.params.id } });
    if (req.body.productIds) {
      // An array of current product_ids.
      const tagProductIds = tagProducts.map(({ product_id }) => product_id);
      // Filters array to include new product_ids.
      const newTagProducts = req.body.productIds
        .filter((product_id) => !tagProductIds.includes(product_id))
        .map((product_id) => {
          return {
            tag_id: req.params.id,
            product_id,
          };
        });
      // Filters list of product_ids to remove necessary ones.
      const tagProductsToRemove = tagProducts
        .filter(({ product_id }) => !req.body.productIds.includes(product_id))
        .map(({ id }) => id);
      // Updates new product_ids and removes the ones needing to be removed.
      let updatedTagProducts = await Promise.all([
        ProductTag.destroy({ where: { id: tagProductsToRemove } }),
        ProductTag.bulkCreate(newTagProducts),
      ]);
      res.status(200).json(updatedTagProducts)
    } else {
      res.status(200).json(tag);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// Deletes an existing tag based on input id.
router.delete('/:id', async (req, res) => {
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!tagData) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;