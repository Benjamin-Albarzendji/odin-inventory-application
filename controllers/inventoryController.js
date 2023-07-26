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
