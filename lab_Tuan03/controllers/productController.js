const ProductService = require('../services/productService');
const CategoryService = require('../services/categoryService');
const { uploadFile } = require('../utils/s3');

class ProductController {
    static async index(req, res) {
        try {
            const filters = {
                categoryId: req.query.category,
                minPrice: req.query.minPrice,
                maxPrice: req.query.maxPrice,
                name: req.query.q
            };

            const lastEvaluatedKey = req.query.nextKey ? JSON.parse(decodeURIComponent(req.query.nextKey)) : null;

            const result = await ProductService.getAll(filters, 10, lastEvaluatedKey);
            const categories = await CategoryService.getAll();

            res.render('products/index', {
                products: result.items,
                categories,
                filters: req.query,
                nextKey: result.lastEvaluatedKey ? encodeURIComponent(JSON.stringify(result.lastEvaluatedKey)) : null,
                user: req.session.user
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }

    static async getCreatePage(req, res) {
        try {
            const categories = await CategoryService.getAll();
            res.render('products/create', { categories, user: req.session.user });
        } catch (error) {
            res.status(500).send('Server Error');
        }
    }

    static async create(req, res) {
        try {
            let url_image = '';
            if (req.file) {
                url_image = await uploadFile(req.file);
            }

            const productData = {
                name: req.body.name,
                price: req.body.price,
                quantity: req.body.quantity,
                categoryId: req.body.categoryId,
                url_image
            };

            await ProductService.create(productData, req.session.user.userId);
            res.redirect('/products');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error creating product');
        }
    }

    static async getEditPage(req, res) {
        try {
            const product = await ProductService.getById(req.params.id);
            const categories = await CategoryService.getAll();
            res.render('products/edit', { product, categories, user: req.session.user });
        } catch (error) {
            res.status(500).send('Server Error');
        }
    }

    static async update(req, res) {
        try {
            const productData = {
                name: req.body.name,
                price: req.body.price,
                quantity: req.body.quantity,
                categoryId: req.body.categoryId
            };

            if (req.file) {
                productData.url_image = await uploadFile(req.file);
            }

            await ProductService.update(req.params.id, productData, req.session.user.userId);
            res.redirect('/products');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error updating product');
        }
    }

    static async delete(req, res) {
        try {
            await ProductService.delete(req.params.id, req.session.user.userId);
            res.redirect('/products');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error deleting product');
        }
    }
}

module.exports = ProductController;
