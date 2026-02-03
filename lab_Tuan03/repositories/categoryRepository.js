const dynamoDb = require('../db/dynamodb');
const { PutCommand, ScanCommand, GetCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = 'Categories';

class CategoryRepository {
    static async getAll() {
        const command = new ScanCommand({
            TableName: TABLE_NAME
        });
        const response = await dynamoDb.send(command);
        return response.Items || [];
    }

    static async getById(categoryId) {
        const command = new GetCommand({
            TableName: TABLE_NAME,
            Key: { categoryId }
        });
        const response = await dynamoDb.send(command);
        return response.Item;
    }

    static async create(categoryData) {
        const categoryId = uuidv4();
        const newCategory = {
            categoryId,
            ...categoryData,
            createdAt: new Date().toISOString()
        };

        const command = new PutCommand({
            TableName: TABLE_NAME,
            Item: newCategory
        });

        await dynamoDb.send(command);
        return newCategory;
    }

    static async update(categoryId, categoryData) {
        const command = new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { categoryId },
            UpdateExpression: 'set #name = :name, description = :description',
            ExpressionAttributeNames: {
                '#name': 'name'
            },
            ExpressionAttributeValues: {
                ':name': categoryData.name,
                ':description': categoryData.description
            },
            ReturnValues: 'ALL_NEW'
        });

        const response = await dynamoDb.send(command);
        return response.Attributes;
    }

    static async delete(categoryId) {
        const command = new DeleteCommand({
            TableName: TABLE_NAME,
            Key: { categoryId }
        });
        await dynamoDb.send(command);
        return true;
    }
}

module.exports = CategoryRepository;
