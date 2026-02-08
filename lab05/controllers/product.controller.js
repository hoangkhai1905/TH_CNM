const ProductModel = require('../models/product.model');

class ProductController {
    static async index(req, res) {
        try {
            const search = req.query.q;
            const products = await ProductModel.getAll(search);
            res.render('products/index', { products, search });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error retrieving products');
        }
    }

    static async showAddForm(req, res) {
        res.render('products/add');
    }

    static async create(req, res) {
        try {
            await ProductModel.create(req.body);
            res.redirect('/products');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error creating product');
        }
    }

    static async showEditForm(req, res) {
        try {
            const product = await ProductModel.getById(req.params.id);
            if (!product) return res.status(404).send('Product not found');
            res.render('products/edit', { product });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error retrieving product');
        }
    }

    static async update(req, res) {
        try {
            await ProductModel.update(req.params.id, req.body);
            res.redirect('/products');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error updating product');
        }
    }

    static async delete(req, res) {
        try {
            await ProductModel.delete(req.params.id);
            res.redirect('/products');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error deleting product');
        }
    }
}

module.exports = ProductController;
