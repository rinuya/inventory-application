var express = require('express');
var router = express.Router();

var category_controller = require("../controllers/categoryController");
/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/catalog/categories');
});

//Render List of Categories
router.get('/categories', category_controller.category_list);

//Render Details of Categories
router.get('/categories/:id', category_controller.category_detail);


module.exports = router;
