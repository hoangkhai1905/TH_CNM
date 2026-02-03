const dynamoDb = require('../db/dynamodb');
const { PutCommand, QueryCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = 'Users';

class UserRepository {
    static async create(user) {
        const userId = uuidv4();
        const newUser = {
            userId,
            ...user,
            createdAt: new Date().toISOString()
        };

        const command = new PutCommand({
            TableName: TABLE_NAME,
            Item: newUser
        });

        await dynamoDb.send(command);
        return newUser;
    }

    static async findByUsername(username) {
        const command = new QueryCommand({
            TableName: TABLE_NAME,
            IndexName: 'UsernameIndex',
            KeyConditionExpression: 'username = :username',
            ExpressionAttributeValues: {
                ':username': username
            }
        });

        const response = await dynamoDb.send(command);
        return response.Items[0];
    }

    static async findById(userId) {
        const command = new GetCommand({
            TableName: TABLE_NAME,
            Key: { userId }
        });

        const response = await dynamoDb.send(command);
        return response.Item;
    }
}

module.exports = UserRepository;
