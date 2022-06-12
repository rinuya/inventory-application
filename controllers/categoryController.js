var Category = require('../models/category');
var Item = require("../models/item");
var async = require('async');
const { body,validationResult } = require('express-validator');


// Display list of all Categories.
exports.category_list = function(req, res, next) {

    Category.find()
      .sort([['name', 'ascending']])
      .exec(function (err, list_categories) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('category_list', { title: 'Category List', category_list: list_categories });
      });
  };

//Category Detail display
exports.category_detail = function(req, res, next) {
    async.parallel({
        category: function (callback) {
            Category.findById(req.params.id)
                .exec(callback);
        },
        items: function (callback){
            Item.find({"category": req.params.id})
                .exec(callback);
        }
    }, function(err, results){
        if (err) {return next(err);}
        if (results.category==null){
            var err = new Error("Category not found");
            err.status = 404;
            return next(err);
        }
        res.render("category_detail", {title: "Category Details", category: results.category, item_list: results.items })
    });
  };