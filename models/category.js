var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorySchema = new Schema(
    {
        name: {type: String, required: true},
        description: {type: String},
    }
  );

// Virtual for book's URL
CategorySchema
.virtual('url')
.get(function () {
  //Routing should be based on category for items!
  return '/catalog/categories/' + this._id;
});

//Export model
module.exports = mongoose.model('Category', CategorySchema);