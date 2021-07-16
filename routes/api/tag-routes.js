// The endpoint for this file: /api/tags

const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

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

router.post('/', async (req, res) => {
  try {
    let tag = await Tag.create(req.body);
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

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    let tag = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    // This method finds all associated products from ProductTag.
    let tagProducts = await ProductTag.findAll({ where: { tag_id: req.params.id } });
    // get list of current product_ids
    if (req.body.productIds) {
      const tagProductIds = tagProducts.map(({ product_id }) => product_id);
      // create filtered list of new product_ids
      const newTagProducts = req.body.productIds
        .filter((product_id) => !tagProductIds.includes(product_id))
        .map((product_id) => {
          return {
            tag_id: req.params.id,
            product_id,
          };
        });
      // figure out which ones to remove
      const tagProductsToRemove = tagProducts
        .filter(({ product_id }) => !req.body.productIds.includes(product_id))
        .map(({ id }) => id);

      // run both actions
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
