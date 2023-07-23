const mongoose = require('mongoose');

const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: { type: String, required: true, maxLength: 100, minLength: 1 },
  description: { type: String, required: true, maxLength: 1000, minLength: 1 },
});

// Virtual for category's URL
CategorySchema.virtual('url').get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/category/${this._id}`;
});

// Export model
module.exports = mongoose.model('Category', CategorySchema);
