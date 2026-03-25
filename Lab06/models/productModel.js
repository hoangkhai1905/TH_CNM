const {
  ScanCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand
} = require('@aws-sdk/lib-dynamodb');

const { docClient } = require('../config/aws');

const TABLE_NAME = 'Products';

async function getAllProducts() {
  const command = new ScanCommand({ TableName: TABLE_NAME });
  const result = await docClient.send(command);
  return result.Items || [];
}

async function getProductById(id) {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { productId: id }
  });
  const result = await docClient.send(command);
  return result.Item;
}

async function createProduct(product) {
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: product
  });
  return docClient.send(command);
}

async function updateProduct(id, data) {
  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { productId: id },
    UpdateExpression:
      'SET #name = :name, price = :price, unit_in_stock = :unit, url_image = :url',
    ExpressionAttributeNames: {
      '#name': 'name' // Tranh xung dot tu khoa
    },
    ExpressionAttributeValues: {
      ':name': data.name,
      ':price': Number(data.price),
      ':unit': Number(data.unit_in_stock),
      ':url': data.url_image
    },
    ReturnValues: 'ALL_NEW'
  });

  const result = await docClient.send(command);
  return result.Attributes;
}

async function deleteProduct(id) {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { productId: id }
  });
  return docClient.send(command);
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
