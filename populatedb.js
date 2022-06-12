#! /usr/bin/env node

console.log('This script populates some test items and categories to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Item = require('./models/item')
var Category = require('./models/category')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = []
var categories = []

//CONTINUE HERE ON SUNDAY

function itemCreate(name, description, numberinstock, price, category, cb) {

  var item = new Item(  
    item = { 
    name: name,
    description: description,
    numberinstock: numberinstock,
    price: price,
    category: category,
  });
       
  item.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Item: ' + item);
    items.push(item)
    cb(null, item)
  }  );
}

function categoryCreate(name, description, cb) {
  var category = new Category({ 
    name: name,
    description: description,
  });
       
  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category);
  }   );
}

function createCategories(cb) {
  async.series([
      function(callback) {
        categoryCreate('Shirts', 'Regular shirts for everyday wear', callback);
      },
      function(callback) {
        categoryCreate('Hoddies', 'Comfortable hoddies for chilly evening nights', callback);
      },
      function(callback) {
        categoryCreate('Pullovers', 'Festive Pullovers!', callback);
      },
      function(callback) {
        categoryCreate('Coats', 'Stylish coats', callback);
      },
      function(callback) {
        categoryCreate('Pants', 'Pants!', callback);
      },

      ],
      // optional callback
      cb);
}
//category 0 would be tshirts
//category 1 would be hoodies
//category 2 would be pullovers
//category 3 would be coats
//category 4 would be pants
function createItems(cb) {
    async.parallel([
        function(callback) {
          itemCreate('Rick and Morty Shirt Unisex', 'A very cool shirt!', 34, 19.95, [categories[0],], callback);
        },
        function(callback) {
          itemCreate('JuJuKai Shirt Unisex', 'The best shirt in this store!', 12, 39.95, [categories[0],], callback);
        },
        function(callback) {
          itemCreate('BreakingBad Shirt Unisex', 'A very cool shirt!', 12, 29.95, [categories[0],], callback);
        },
        function(callback) {
          itemCreate('White Shirt Unisex', 'A simple shirt', 32, 9.95, [categories[0],], callback);
        },
        function(callback) {
          itemCreate('Black Shirt Unisex', 'A simple shirt', 17, 9.95, [categories[0],], callback);
        },

        function(callback) {
          itemCreate('StreetArt Hoodie Unisex', 'A very cool hoddie!', 14, 39.95, [categories[1],], callback);
        },
        function(callback) {
          itemCreate('Itadori Hoodie Unisex', 'A very cool hoddie!', 12, 49.95, [categories[1],], callback);
        },
        function(callback) {
          itemCreate('BreakingBad Hoodie Unisex', 'A very cool hoddie!', 12, 39.95, [categories[1],], callback);
        },
        function(callback) {
          itemCreate('White Hoodie Unisex', 'A simple hoddie', 32, 19.95, [categories[1],], callback);
        },
        function(callback) {
          itemCreate('Black Hoodie Unisex', 'A simple hoddie', 17, 19.95, [categories[1],], callback);
        },

        function(callback) {
          itemCreate('Thanksgiving Pullover Unisex', 'A turkey themed pullover!', 7, 99.95, [categories[2],], callback);
        },
        function(callback) {
          itemCreate('Winter Pullover Unisex', 'A pullover!', 11, 69.95, [categories[2],], callback);
        },
        function(callback) {
          itemCreate('Holiday Pullover Unisex', 'A very cool pullover!', 9, 49.95, [categories[2],], callback);
        },
        function(callback) {
          itemCreate('Christmas Pullover Unisex', 'A very cool pullover!', 3, 59.95, [categories[2],], callback);
        },

        function(callback) {
          itemCreate('Black Coat Unisex', 'Stylish coat!', 3, 159.95, [categories[3],], callback);
        },

        function(callback) {
          itemCreate('Black Techwear Pants Unisex', 'Modern pants!', 32, 59.95, [categories[4],], callback);
        },
        function(callback) {
          itemCreate('Striped Techwear Pants Unisex', 'Modern pants!', 33, 59.95, [categories[4],], callback);
        },
        function(callback) {
          itemCreate('Blue Jeans Unisex', 'Old fashioned Blue jeans!', 63, 59.95, [categories[4],], callback);
        },

        ],
        // optional callback
        cb);
}


async.series([
  createCategories,
  createItems,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    // All done, disconnect from database
    mongoose.connection.close();
});
