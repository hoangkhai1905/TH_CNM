const dynamoDb = require('../db/dynamodb');
const { PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = process.env.DYNAMODB_PRODUCTS_TABLE || 'Products';

class ProductModel {
    // Lấy tất cả sản phẩm
    static async getAll() {
        try {
            const command = new ScanCommand({
                TableName: TABLE_NAME
            });
            
            const response = await dynamoDb.send(command);
            return response.Items || [];
        } catch (error) {
            console.error('Error getting all products:', error);
            throw error;
        }
    }

    // Lấy sản phẩm theo ID
    static async getById(id) {
        try {
            const command = new GetCommand({
                TableName: TABLE_NAME,
                Key: { id }
            });
            
            const response = await dynamoDb.send(command);
            return response.Item;
        } catch (error) {
            console.error('Error getting product by ID:', error);
            throw error;
        }
    }

    // Thêm sản phẩm mới
    static async create(name, price, quantity, url_image = '') {
        try {
            const id = uuidv4(); // Tạo UUID cho sản phẩm mới
            
            const command = new PutCommand({
                TableName: TABLE_NAME,
                Item: {
                    id,
                    name,
                    price: Number(price),
                    quantity: Number(quantity),
                    url_image,
                    createdAt: new Date().toISOString()
                }
            });
            
            await dynamoDb.send(command);
            return { id, name, price, quantity, url_image };
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }

    // Cập nhật sản phẩm
    static async update(id, name, price, quantity, url_image = '') {
        try {
            const command = new UpdateCommand({
                TableName: TABLE_NAME,
                Key: { id },
                UpdateExpression: 'SET #name = :name, price = :price, quantity = :quantity, url_image = :url_image, updatedAt = :updatedAt',
                ExpressionAttributeNames: {
                    '#name': 'name'
                },
                ExpressionAttributeValues: {
                    ':name': name,
                    ':price': Number(price),
                    ':quantity': Number(quantity),
                    ':url_image': url_image,
                    ':updatedAt': new Date().toISOString()
                },
                ReturnValues: 'ALL_NEW'
            });
            
            const response = await dynamoDb.send(command);
            return response.Attributes;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    // Xóa sản phẩm
    static async delete(id) {
        try {
            const command = new DeleteCommand({
                TableName: TABLE_NAME,
                Key: { id }
            });
            
            await dynamoDb.send(command);
            return { success: true };
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }
}

module.exports = ProductModel;
