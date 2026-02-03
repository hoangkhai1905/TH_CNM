const dynamoDb = require('../db/dynamodb');
const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = 'ProductLogs';

class LogRepository {
    static async create(logData) {
        const logId = uuidv4();
        const newLog = {
            logId,
            ...logData,
            time: new Date().toISOString()
        };

        const command = new PutCommand({
            TableName: TABLE_NAME,
            Item: newLog
        });

        await dynamoDb.send(command);
        return newLog;
    }
}

module.exports = LogRepository;
