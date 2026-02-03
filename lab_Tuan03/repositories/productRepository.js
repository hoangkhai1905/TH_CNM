const dynamoDb = require('../db/dynamodb');
const { PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = 'Products';

class ProductRepository {
    static async create(productData) {
        const id = uuidv4();
        const newProduct = {
            id,
            ...productData,
            isDeleted: false,
            createdAt: new Date().toISOString()
        };

        const command = new PutCommand({
            TableName: TABLE_NAME,
            Item: newProduct
        });

        await dynamoDb.send(command);
        return newProduct;
    }

    static async getById(id) {
        const command = new GetCommand({
            TableName: TABLE_NAME,
            Key: { id }
        });
        const response = await dynamoDb.send(command);
        return response.Item;
    }

    static async update(id, productData) {
        // Construct UpdateExpression dynamically
        let updateExp = 'set ';
        const expAttrValues = {};
        const expAttrNames = {};

        const keys = Object.keys(productData);
        keys.forEach((key, index) => {
            const attrName = `#${key}`;
            const attrValue = `:${key}`;
            updateExp += `${attrName} = ${attrValue}`;
            if (index < keys.length - 1) updateExp += ', ';

            expAttrNames[attrName] = key;
            expAttrValues[attrValue] = productData[key];
        });

        expAttrValues[':updatedAt'] = new Date().toISOString();
        updateExp += ', updatedAt = :updatedAt';

        const command = new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { id },
            UpdateExpression: updateExp,
            ExpressionAttributeNames: expAttrNames,
            ExpressionAttributeValues: expAttrValues,
            ReturnValues: 'ALL_NEW'
        });

        const response = await dynamoDb.send(command);
        return response.Attributes;
    }

    static async getAll(filters = {}, limit = 10, lastEvaluatedKey = null) {
        const params = {
            TableName: TABLE_NAME,
            Limit: limit,
            FilterExpression: 'isDeleted = :isDeleted',
            ExpressionAttributeValues: {
                ':isDeleted': false
            }
        };

        if (lastEvaluatedKey) {
            params.ExclusiveStartKey = lastEvaluatedKey;
        }

        if (filters.categoryId) {
            params.FilterExpression += ' AND categoryId = :categoryId';
            params.ExpressionAttributeValues[':categoryId'] = filters.categoryId;
        }

        if (filters.minPrice !== undefined) {
            params.FilterExpression += ' AND price >= :minPrice';
            params.ExpressionAttributeValues[':minPrice'] = Number(filters.minPrice);
        }

        if (filters.maxPrice !== undefined) {
            params.FilterExpression += ' AND price <= :maxPrice';
            params.ExpressionAttributeValues[':maxPrice'] = Number(filters.maxPrice);
        }

        if (filters.name) {
            params.FilterExpression += ' AND contains(#name, :name)';
            params.ExpressionAttributeNames = params.ExpressionAttributeNames || {};
            params.ExpressionAttributeNames['#name'] = 'name';
            params.ExpressionAttributeValues[':name'] = filters.name;
        }

        const command = new ScanCommand(params);
        const response = await dynamoDb.send(command);

        return {
            items: response.Items,
            lastEvaluatedKey: response.LastEvaluatedKey
        };
    }

    static async softDelete(id) {
        return this.update(id, { isDeleted: true });
    }
}

module.exports = ProductRepository;
