#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const mongoose = require('mongoose');
const Item = require('./models/item');
const Category = require('./models/category');

const items = [];
const categories = [];

mongoose.set('strictQuery', false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createCategories();
  await createItems();
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.

async function createCategories() {
  console.log('Adding categories');
  await Promise.all([
    categoryCreate(0, 'Power Tools', 'Tools that use electricity'),
    categoryCreate(1, 'Ancient Tools', 'Tools that use no electricity'),
    categoryCreate(2, 'Future Tools', 'Tools that use magic power'),
  ]);
}

async function categoryCreate(index, name, description) {
  const category = new Category({ name, description });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function createItems() {
  console.log('Adding items');
  await Promise.all([
    itemCreate(0, 'Hammer', "It's a hammer", categories[1], 99, 10),
    itemCreate(1, 'Saw', "It's a saw", categories[1], 500, 5),
    itemCreate(2, 'Drill', "It's a drill", categories[0], 1000, 2),
    itemCreate(3, 'Screwdriver', "It's a screwdriver", categories[1], 50, 20),
    itemCreate(4, 'Wrench', "It's a wrench", categories[1], 100, 10),
    itemCreate(5, 'Sander', "It's a sander", categories[0], 200, 5),
    itemCreate(6, 'Chisel', "It's a chisel", categories[1], 100, 10),
    itemCreate(
      7,
      'Future Lathe',
      "It's a future lathe",
      categories[2],
      1000,
      2
    ),
    itemCreate(
      8,
      'Future Hammer',
      "It's a future hammer",
      categories[2],
      1000,
      2
    ),
    itemCreate(9, 'Future Saw', "It's a futuresaw", categories[2], 1000, 2),
  ]);
}

async function itemCreate(index, name, description, category, price, stock) {
  const itemdetail = {
    name,
    description,
    category,
    price,
    stock,
  };

  const item = new Item(itemdetail);

  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}
