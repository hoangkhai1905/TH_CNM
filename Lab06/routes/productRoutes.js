const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const productController = require('../controllers/productController');

router.get('/', productController.showList);

router.get('/products/create', productController.showCreateForm);
router.post('/products/create', upload.single('image'), productController.createProduct);

router.get('/products/:productId', productController.showDetail);

router.get('/products/:productId/edit', productController.showEditForm);
router.post('/products/:productId/edit', upload.single('image'), productController.updateProduct);

router.post('/products/:productId/delete', productController.deleteProduct);

module.exports = router;
