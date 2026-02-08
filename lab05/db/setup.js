require('dotenv').config();
const { CreateTableCommand, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
const { client } = require('./dynamodb');

async function setupTables() {
    try {
        const listTablesCommand = new ListTablesCommand({});
        const { TableNames } = await client.send(listTablesCommand);

        if (!TableNames.includes('Products')) {
            const createTableCommand = new CreateTableCommand({
                TableName: 'Products',
                KeySchema: [
                    { AttributeName: 'id', KeyType: 'HASH' }
                ],
                AttributeDefinitions: [
                    { AttributeName: 'id', AttributeType: 'S' }
                ],
                BillingMode: 'PAY_PER_REQUEST'
            });

            await client.send(createTableCommand);
            console.log('Created Products table successfully');
        } else {
            console.log('Products table already exists');
        }
    } catch (error) {
        console.error('Error setting up tables:', error);
    }
}

setupTables();
