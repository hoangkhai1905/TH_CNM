const ProductRepository = require('../repositories/productRepository');
const LogRepository = require('../repositories/logRepository');
const { getFileSignedUrl } = require('../utils/s3');

class ProductService {
    static async getAll(filters = {}, limit = 10, lastEvaluatedKey = null) {
        const result = await ProductRepository.getAll(filters, limit, lastEvaluatedKey);

        // Add inventory status
        // Add inventory status and sign image URLs
        result.items = await Promise.all(result.items.map(async product => {
            let status = 'in_stock';
            if (product.quantity === 0) status = 'out_of_stock';
            else if (product.quantity < 5) status = 'low_stock';

            // Sign URL if exists
            if (product.url_image) {
                product.url_image = await getFileSignedUrl(product.url_image);
            }

            return {
                ...product,
                inventoryStatus: status
            };
        }));

        return result;
    }

    static async getById(id) {
        const product = await ProductRepository.getById(id);
        if (product) {
            let status = 'in_stock';
            if (product.quantity === 0) status = 'out_of_stock';
            else if (product.quantity < 5) status = 'low_stock';
            product.inventoryStatus = status;

            // Sign URL if exists
            if (product.url_image) {
                product.url_image = await getFileSignedUrl(product.url_image);
            }
        }
        return product;
    }

    static async create(data, userId) {
        const product = await ProductRepository.create(data);

        await LogRepository.create({
            productId: product.id,
            action: 'CREATE',
            userId
        });

        return product;
    }

    static async update(id, data, userId) {
        const updatedProduct = await ProductRepository.update(id, data);

        await LogRepository.create({
            productId: id,
            action: 'UPDATE',
            userId
        });

        return updatedProduct;
    }

    static async delete(id, userId) {
        // Soft delete
        await ProductRepository.softDelete(id);

        await LogRepository.create({
            productId: id,
            action: 'DELETE', // Log as DELETE even though soft
            userId
        });

        return true;
    }
}

module.exports = ProductService;
