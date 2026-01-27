require('dotenv').config();
const { 
    CreateTableCommand, 
    ListTablesCommand,
    DescribeTableCommand 
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
        // Kiểm tra các bảng đã tồn tại
        const listTablesCommand = new ListTablesCommand({});
        const { TableNames } = await client.send(listTablesCommand);
        
        console.log('Existing tables:', TableNames);

        // Tạo bảng Products nếu chưa tồn tại
        if (!TableNames.includes('Products')) {
            const createProductsTableCommand = new CreateTableCommand({
                TableName: 'Products',
                KeySchema: [
                    { AttributeName: 'id', KeyType: 'HASH' } // Partition key
                ],
                AttributeDefinitions: [
                    { AttributeName: 'id', AttributeType: 'S' }
                ],
                BillingMode: 'PAY_PER_REQUEST' // On-demand pricing
            });

            await client.send(createProductsTableCommand);
            console.log('✅ Created Products table');
        } else {
            console.log('✅ Products table already exists');
        }

        // Tạo bảng Users nếu chưa tồn tại
        if (!TableNames.includes('Users')) {
            const createUsersTableCommand = new CreateTableCommand({
                TableName: 'Users',
                KeySchema: [
                    { AttributeName: 'username', KeyType: 'HASH' } // Partition key
                ],
                AttributeDefinitions: [
                    { AttributeName: 'username', AttributeType: 'S' }
                ],
                BillingMode: 'PAY_PER_REQUEST'
            });

            await client.send(createUsersTableCommand);
            console.log('✅ Created Users table');
        } else {
            console.log('✅ Users table already exists');
        }

        console.log('\n📋 Setup completed successfully!');
        console.log('\nNote: Bạn cần thêm user mặc định vào bảng Users:');
        console.log('Username: admin');
        console.log('Password: admin');
        console.log('\nBạn có thể dùng AWS Console hoặc AWS CLI để thêm dữ liệu mẫu.');

    } catch (error) {
        console.error('❌ Error setting up tables:', error);
    }
}

// Chạy setup
setupTables();
