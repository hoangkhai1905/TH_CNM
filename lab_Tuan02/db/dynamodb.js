require('dotenv').config();
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

// Cấu hình DynamoDB Client
const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'ap-southeast-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Tạo Document Client để làm việc dễ dàng hơn với DynamoDB
const dynamoDb = DynamoDBDocumentClient.from(client, {
    marshallOptions: {
        removeUndefinedValues: true,
        convertEmptyValues: false
    },
    unmarshallOptions: {
        wrapNumbers: false
    }
});

module.exports = dynamoDb;
