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

exports.category_delete_get = function(req, res, next) {

};
exports.category_delete_post = []

exports.category_create_get = function(req, res, next) {
    res.render("category_form", {title: "Create Category"});
};
exports.category_create_post = [
    // Validate and sanitize the name field.
    body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),
    body("description", "Description is required").trim().isLength({ min: 1 }).escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
  
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create a genre object with escaped and trimmed data.
      var category = new Category(
        { name: req.body.name,
          description: req.body.description,
        }
      );
  
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render('category_form', { title: 'Create Category', category: category, errors: errors.array()});
        return;
      }
      else {
        // Data from form is valid.
        // Check if Genre with same name already exists.
        Category.findOne({ 'name': req.body.name })
          .exec( function(err, found_category) {
             if (err) { return next(err); }
  
             if (found_category) {
               // Genre exists, redirect to its detail page.
               res.redirect(found_category.url);
             }
             else {
               category.save(function (err) {
                 if (err) { return next(err); }
                 // Genre saved. Redirect to genre detail page.
                 res.redirect(category.url);
               });
             }
           });
      }
    }
]

exports.category_update_get = function(req, res, next) {
    
};
exports.category_update_post = []