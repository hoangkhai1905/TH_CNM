const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');
const { requireAuth, requireAdmin } = require('../middlewares/auth.middleware');

router.use(requireAuth);
router.use(requireAdmin); // Categories are admin only

router.get('/', CategoryController.index);
router.get('/create', CategoryController.getCreatePage);
router.post('/', CategoryController.create);
router.get('/:id/edit', CategoryController.getEditPage);
router.post('/:id', CategoryController.update);
router.post('/:id/delete', CategoryController.delete); // Use POST for delete form

module.exports = router;
