const express = require('express');
const IndexController = require('../controllers');
var router = express.Router();

// make API list routes
router.get('/categories' , IndexController.getCategories)
router.get('/products', IndexController.getProducts)
router.put('/products', IndexController.addProduct)
router.put('/edit_product' , IndexController.editProduct)
router.put('/assets' , IndexController.addAssets)
router.delete('/products' , IndexController.deleteProduct)
router.delete('/assets' , IndexController.deleteAssets)

module.exports = router;