require('dotenv').config();
const {
    CreateTableCommand,
    ListTablesCommand,
} = require('@aws-sdk/client-dynamodb');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'ap-southeast-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

async function setupTables() {
    try {
        const listTablesCommand = new ListTablesCommand({});
        const { TableNames } = await client.send(listTablesCommand);

        console.log('Existing tables:', TableNames);

        // 1. Users Table
        if (!TableNames.includes('Users')) {
            await client.send(new CreateTableCommand({
                TableName: 'Users',
                KeySchema: [{ AttributeName: 'userId', KeyType: 'HASH' }],
                AttributeDefinitions: [
                    { AttributeName: 'userId', AttributeType: 'S' },
                    { AttributeName: 'username', AttributeType: 'S' }
                ],
                GlobalSecondaryIndexes: [{
                    IndexName: 'UsernameIndex',
                    KeySchema: [{ AttributeName: 'username', KeyType: 'HASH' }],
                    Projection: { ProjectionType: 'ALL' }
                }],
                BillingMode: 'PAY_PER_REQUEST'
            }));
            console.log('Created Users table');
        }

        // 2. Categories Table
        if (!TableNames.includes('Categories')) {
            await client.send(new CreateTableCommand({
                TableName: 'Categories',
                KeySchema: [{ AttributeName: 'categoryId', KeyType: 'HASH' }],
                AttributeDefinitions: [
                    { AttributeName: 'categoryId', AttributeType: 'S' }
                ],
                BillingMode: 'PAY_PER_REQUEST'
            }));
            console.log('Created Categories table');
        }

        // 3. Products Table
        if (!TableNames.includes('Products')) {
            await client.send(new CreateTableCommand({
                TableName: 'Products',
                KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
                AttributeDefinitions: [
                    { AttributeName: 'id', AttributeType: 'S' }
                ],
                BillingMode: 'PAY_PER_REQUEST'
            }));
            console.log('Created Products table');
        }

        // 4. ProductLogs Table
        if (!TableNames.includes('ProductLogs')) {
            await client.send(new CreateTableCommand({
                TableName: 'ProductLogs',
                KeySchema: [{ AttributeName: 'logId', KeyType: 'HASH' }],
                AttributeDefinitions: [
                    { AttributeName: 'logId', AttributeType: 'S' },
                    { AttributeName: 'productId', AttributeType: 'S' }
                ],
                GlobalSecondaryIndexes: [{
                    IndexName: 'ProductLogIndex',
                    KeySchema: [{ AttributeName: 'productId', KeyType: 'HASH' }],
                    Projection: { ProjectionType: 'ALL' }
                }],
                BillingMode: 'PAY_PER_REQUEST'
            }));
            console.log('Created ProductLogs table');
        }

        console.log('\nSetup completed successfully!');
    } catch (error) {
        console.error('Error setting up tables:', error);
    }
}

setupTables();
