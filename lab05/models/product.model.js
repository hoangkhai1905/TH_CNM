const { dynamoDb } = require('../db/dynamodb');
const { PutCommand, ScanCommand, GetCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = 'Products';

class ProductModel {
    static async getAll(search = null) {
        const params = {
            TableName: TABLE_NAME
        };

        if (search) {
            params.FilterExpression = 'contains(#name, :search)';
            params.ExpressionAttributeNames = { '#name': 'name' };
            params.ExpressionAttributeValues = { ':search': search };
        }

        const command = new ScanCommand(params);
        const result = await dynamoDb.send(command);
        return result.Items || [];
    }

    static async getById(id) {
        const command = new GetCommand({
            TableName: TABLE_NAME,
            Key: { id }
        });
        const result = await dynamoDb.send(command);
        return result.Item;
    }

    static async create(data) {
        const id = uuidv4();
        const newProduct = {
            id,
            name: data.name,
            price: Number(data.price),
            url_image: data.url_image
        };
        
        const command = new PutCommand({
            TableName: TABLE_NAME,
            Item: newProduct
        });
        
        await dynamoDb.send(command);
        return newProduct;
    }

    static async update(id, data) {
        const command = new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { id },
            UpdateExpression: 'set #name = :name, price = :price, url_image = :url_image',
            ExpressionAttributeNames: {
                '#name': 'name'
            },
            ExpressionAttributeValues: {
                ':name': data.name,
                ':price': Number(data.price),
                ':url_image': data.url_image
            },
            ReturnValues: 'ALL_NEW'
        });
        
        await dynamoDb.send(command);
    }

    static async delete(id) {
        const command = new DeleteCommand({
            TableName: TABLE_NAME,
            Key: { id }
        });
        await dynamoDb.send(command);
    }
}

module.exports = ProductModel;
