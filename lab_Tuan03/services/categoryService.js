const CategoryRepository = require('../repositories/categoryRepository');

class CategoryService {
    static async getAll() {
        return await CategoryRepository.getAll();
    }

    static async getById(id) {
        return await CategoryRepository.getById(id);
    }

    static async create(data) {
        return await CategoryRepository.create(data);
    }

    static async update(id, data) {
        return await CategoryRepository.update(id, data);
    }

    static async delete(id) {
        // Business rule: Check if products exist in category? Guide says:
        // "Khi xoá category → không xoá sản phẩm (business rule)"
        // But maybe we should prevent if used? Or just allow.
        // Guide doesn't specify constraint, just says products belong to 1 category.
        return await CategoryRepository.delete(id);
    }
}

module.exports = CategoryService;
