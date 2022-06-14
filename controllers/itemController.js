var Item = require("../models/item");
var Category = require('../models/category');
var async = require('async');
const { body,validationResult } = require('express-validator');


exports.item_detail = function(req, res, next) {
    Item.findById(req.params.id)
    .exec(function (err, querieditem){
        if (err) { return next(err);}
        //Successful, so render
        res.render("item_detail", { title: "Item Details", item: querieditem});
    })
};

exports.item_create_get = function(req, res, next) {
    Category.find()
    .exec(function (err, queriedcategories){
        if(err){return next(err);}
        res.render("item_form", {title: "Create Item", category_list: queriedcategories});
    })
};

exports.item_create_post = [

    body("name", "Name must not be empty").trim().isLength({min: 1}).escape(),
    body("description", "Description must not be empty").trim().isLength({min: 1}).escape(),
    body("numberinstock", "Name must not be empty").isNumeric().trim().isLength({min: 1}).escape(),
    body("price", "Name must not be empty").trim().isNumeric().isLength({min: 1}).escape(),
    body("category").escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        var item = new Item({
            name: req.body.name,
            description: req.body.description,
            numberinstock: req.body.numberinstock,
            price: req.body.price,
            category: req.body.category,
        });
        if(!errors.isEmpty()){
            res.render("item_form", {title: "Create Item", item: item, erorrs: errors.array()})
            return;
        } else {
            item.save(function(err){
                if(err) {return next(err);}
                res.redirect(item.url)
            })
        }
    }
]


exports.item_delete_get = function(req, res, next){
    Item.findById(req.params.id)
    .populate('category')
    .exec(function(err, querieditem){
        if(err){return next(err)}
        res.render("item_delete", {title: "Delete Item", item: querieditem, category: querieditem.category.name})
    })
}

exports.item_delete_post = function(req, res, next){
    Item.findByIdAndDelete(req.body.itemid, function deleteItem(err){
          if(err) {return next(err);}
          res.redirect("/catalog/categories")
        })
  }


exports.item_update_get = function(req, res, next){
    async.parallel({
        item: function(callback){
            Item.findById(req.params.id).exec(callback)
        },
        categories: function(callback){
            Category.find().exec(callback)
        },
    },function(err, results){
            if(err) {return next(err)}
        res.render("item_form", {title: "Update Item", item: results.item, category_list: results.categories})
    })
}
exports.item_update_post = [
    body("name", "Name must not be empty").trim().isLength({min: 1}).escape(),
    body("description", "Description must not be empty").trim().isLength({min: 1}).escape(),
    body("numberinstock", "Name must not be empty").isNumeric().trim().isLength({min: 1}).escape(),
    body("price", "Name must not be empty").trim().isNumeric().isLength({min: 1}).escape(),
    body("category").escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        var item = new Item({
            name: req.body.name,
            description: req.body.description,
            numberinstock: req.body.numberinstock,
            price: req.body.price,
            category: req.body.category,
            _id: req.params.id,})

        if(!errors.isEmpty()){
            //There are errors, rerender
            Category.find().exec(function(err, category_list){
                res.render("item_form", {title: "Update item", item: item, category_list: category_list, errors: errors.array()});
            })
        }else{
            Item.findByIdAndUpdate(req.params.id, item, {}, function(err, theitem){
              if(err) {return next(err);}
              res.redirect(theitem.url)
            })
          }
    }
]