const express = require('express');

const router = express.Router();

const inventoryController = require('../controllers/inventoryController');

/* GET home page. */
router.get('/', inventoryController.index);

// // GET request for list of all item.
router.get('/inventory', inventoryController.inventory_list);

// // GET request for creating a Inventory. NOTE This must come before routes that display Inventory (uses id).
router.get('/inventory/create', inventoryController.inventory_create_get);

// // POST request for creating item.
router.post('/inventory/create', inventoryController.inventory_create_post);

// // GET request to delete item.
router.get('/inventory/:id/delete', inventoryController.inventory_delete_get);

// // POST request to delete item.
router.post('/inventory/:id/delete', inventoryController.inventory_delete_post);

// // GET request to update item.
router.get('/inventory/:id/update', inventoryController.inventory_update_get);

// // POST request to update item.
router.post('/inventory/:id/update', inventoryController.inventory_update_post);

// // GET request for one item.
router.get('/inventory/:id', inventoryController.inventory_detail);

// // GET request for list of all categories.
router.get('/categories', inventoryController.category_list);

// // GET request for one category.
router.get('/category/:id', inventoryController.category_detail);

module.exports = router;
