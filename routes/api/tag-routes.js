// The endpoint for this file: /api/products

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
    if (!productData) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* router.post('/', async (req, res) => {
  try {
    const tagData = await Product.create(req.body);
    if (req.body.productIds.length) {
      const tagProductIdArr = req.body.productIds.map((product_id) => {
        return {
          tag_id: tag.id,
          product_id,
        };
      });
      return ProductTag.bulkCreate(tagProductIdArr);
    }
    res.status(200).json(tagData);
    const tagProductIds = await 
  } catch (err) {
    res.status(400).json(err);
  }
}); */
router.post('/', (req, res) => {
  Product.create(req.body)
    .then((product) => {
      if (req.body.productIds.length) {
        const tagProductIdArr = req.body.productIds.map((product_id) => {
          return {
            tag_id: tag.id,
            product_id,
          };
        });
        return ProductTag.bulkCreate(tagProductIdArr);
      }
      res.status(200).json(tagData);
    })
    .then((tagProductIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
  .then((tag) => {
    // find all associated products from ProductTag
    return ProductTag.findAll({ where: { tag_id: req.params.id } });
  })
  .then((tagProducts) => {
    // get list of current product_ids
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
    return Promise.all([
      ProductTag.destroy({ where: { id: tagProductsToRemove } }),
      ProductTag.bulkCreate(newTagProducts),
    ]);
  })
  .then((updatedTagProducts) => res.json(updatedTagProducts))
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
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
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
