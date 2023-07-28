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

// Inventory create on GET.
exports.inventory_create_get = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({}).exec();

  res.render('inventory_form', {
    title: 'Create Item',
    categories,
  });
});

//  Inventory create on POST.
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
// Get the inventory detail
exports.inventory_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate('category').exec();

  if (item == null) {
    const err = new Error('Item not found');
    err.status = 404;
    return next(err);
  }

  res.render('inventory_detail', {
    title: 'Item Detail',
    item,
  });
});

// Get the inventory list
exports.inventory_list = asyncHandler(async (req, res, next) => {
  const items = await Item.find({}).populate('category').exec();

  res.render('inventory_list', {
    title: 'Inventory List',
    items,
  });
});
// Get the category list
exports.category_list = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({}).exec();

  res.render('category_list', {
    title: 'Category List',
    categories,
  });
});

// Get the category detail items
exports.category_detail = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();

  if (category == null) {
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }

  const items = await Item.find({ category: req.params.id }).exec();

  res.render('category_detail', {
    title: 'Category Detail',
    category,
    items,
  });
});

// Get the inventory delete on GET.
exports.inventory_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();

  if (item == null) {
    res.redirect('/inventory');
  }

  res.render('inventory_delete', {
    title: 'Delete Item',
    item,
  });
});

// Get the inventory delete on POST.
exports.inventory_delete_post = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.itemid).exec();

  if (item == null) {
    res.redirect('/inventory');
  }

  await Item.findByIdAndRemove(req.body.itemid);

  res.redirect('/inventory');
});

// Get the inventory update on GET.
exports.inventory_update_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();
  const categories = await Category.find({}).exec();

  if (item == null) {
    res.redirect('/inventory');
  }

  res.render('inventory_form', {
    title: 'Update Item',
    item,
    categories,
  });
});

// Get the inventory update on POST.
exports.inventory_update_post = [
  // Validate and sanitize fields.
  body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description must not be empty.').trim(),
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
    // Extract errors from a request.
    const errors = validationResult(req);

    // Create an Item object with escaped and trimmed data.
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      const categories = await Category.find({}).exec();

      res.render('inventory_form', {
        title: 'Update Item',
        categories,
        item,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Update the record.
      await Item.findByIdAndUpdate(req.params.id, item, {});
      // Successful - redirect to item detail page.
      res.redirect('/');
    }
  }),
];
