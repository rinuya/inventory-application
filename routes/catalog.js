var express = require('express');
var router = express.Router();

var category_controller = require("../controllers/categoryController");
var item_controller = require("../controllers/itemController")
/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/catalog/categories');
});

//Render List of Categories
router.get('/categories', category_controller.category_list);

//Render Details of Categories
router.get('/categories/:id', category_controller.category_detail);

router.get('/categories/:id/delete', category_controller.category_delete_get);

router.post('/categories/:id/delete', category_controller.category_delete_post);

router.get('/categories/:id/update', category_controller.category_update_get);

router.post('/categories/:id/update', category_controller.category_update_post);


//render create of category
router.get("/addcategory", category_controller.category_create_get)

router.post("/addcategory", category_controller.category_create_post)



//Render Items
router.get("/categories/:category/:id", item_controller.item_detail)

//render create of item
router.get("/additem", item_controller.item_create_get)


module.exports = router;
