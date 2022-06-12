var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = new Schema(
    {
      name: {type: String, required: true},
      description: {type: String},
      numberinstock: {type: Number, required: true},
      price: {type: Number , required: true},
      category: [{type: Schema.Types.ObjectId, ref: 'Category', required: true}]
    }
  );

// Virtual for book's URL
ItemSchema
.virtual('url')
.get(function () {
  return '/catalog/categories/' + this.category + "/" + this._id;
});

//Export model
module.exports = mongoose.model('Item', ItemSchema);