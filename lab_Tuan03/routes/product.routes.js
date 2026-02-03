const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { requireAuth, requireAdmin } = require('../middlewares/auth.middleware');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

// Public/Staff routes (Require login)
router.get('/', requireAuth, ProductController.index);

// Admin routes
router.get('/create', requireAuth, requireAdmin, ProductController.getCreatePage);
router.post('/', requireAuth, requireAdmin, upload.single('image'), ProductController.create);

router.get('/:id/edit', requireAuth, requireAdmin, ProductController.getEditPage);
router.post('/:id', requireAuth, requireAdmin, upload.single('image'), ProductController.update);

router.post('/:id/delete', requireAuth, requireAdmin, ProductController.delete);

module.exports = router;
