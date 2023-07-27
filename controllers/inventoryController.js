const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

// Models imported
const Item = require('../models/item');
const Category = require('../models/category');

// Display home page
exports.index = asyncHandler(async (req, res, next) => {
  const [numItems, numCategories] = await Promise.all([
    Item.find({}).populate('category').exec(),
    Category.find({}).exec(),
  ]);

  res.render('index', {
    title: 'Odin Inventory Application',
    items: numItems,
  });
});

exports.inventory_create_get = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({}).exec();

  res.render('inventory_form', {
    title: 'Create Item',
    categories,
  });
});

exports.inventory_create_post = [
  // Validate and sanitize fields.
  body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('price', 'Price must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('stock', 'Stock must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create an Item object with escaped and trimmed data.
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      const categories = await Category.find({}).exec();

      res.render('inventory_form', {
        title: 'Create Item',
        categories,
        item,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save item.
      await item.save();
      // Successful - redirect to new item record.
      res.redirect('/');
    }
  }),
];
