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