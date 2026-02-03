const CategoryService = require('../services/categoryService');

class CategoryController {
    static async index(req, res) {
        try {
            const categories = await CategoryService.getAll();
            res.render('categories/index', { categories, user: req.session.user });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    static getCreatePage(req, res) {
        res.render('categories/create', { user: req.session.user });
    }

    static async create(req, res) {
        try {
            await CategoryService.create(req.body);
            res.redirect('/categories');
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    static async getEditPage(req, res) {
        try {
            const category = await CategoryService.getById(req.params.id);
            res.render('categories/edit', { category, user: req.session.user });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    static async update(req, res) {
        try {
            await CategoryService.update(req.params.id, req.body);
            res.redirect('/categories');
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    static async delete(req, res) {
        try {
            await CategoryService.delete(req.params.id);
            res.redirect('/categories');
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}

module.exports = CategoryController;
