const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

// Tất cả routes đều cần đăng nhập
router.use(requireAuth);

// Hiển thị danh sách sản phẩm
router.get('/', ProductController.index);

// Hiển thị form thêm sản phẩm
router.get('/add', ProductController.showAddForm);

// Thêm sản phẩm
router.post('/add', ProductController.create);

// Hiển thị form sửa sản phẩm
router.get('/edit/:id', ProductController.showEditForm);

// Cập nhật sản phẩm
router.post('/edit/:id', ProductController.update);

// Xóa sản phẩm
router.post('/delete/:id', ProductController.delete);

module.exports = router;