const { v4: uuidv4 } = require('uuid');
const productModel = require('../models/productModel');
const { uploadFileToS3 } = require('../services/s3Service');

async function showList(req, res) {
  const products = await productModel.getAllProducts();
  res.render('products/list', { products });
}

async function showDetail(req, res) {
  const product = await productModel.getProductById(req.params.productId);
  if (!product) return res.status(404).send('Khong tim thay san pham');
  res.render('products/detail', { product });
}

function showCreateForm(req, res) {
  res.render('products/form', {
    product: null,
    action: '/products/create',
    title: 'Them san pham'
  });
}

async function createProduct(req, res) {
  const imageUrl = await uploadFileToS3(req.file);

  const newProduct = {
    productId: uuidv4(),
    name: req.body.name,
    price: Number(req.body.price),
    unit_in_stock: Number(req.body.unit_in_stock),
    url_image: imageUrl
  };

  await productModel.createProduct(newProduct);
  res.redirect('/');
}

async function showEditForm(req, res) {
  const product = await productModel.getProductById(req.params.productId);
  if (!product) return res.status(404).send('Khong tim thay san pham');

  res.render('products/form', {
    product,
    action: `/products/${product.productId}/edit`,
    title: 'Sua san pham'
  });
}

async function updateProduct(req, res) {
  const oldProduct = await productModel.getProductById(req.params.productId);
  if (!oldProduct) return res.status(404).send('Khong tim thay san pham');

  let imageUrl = oldProduct.url_image;

  // Neu co upload anh moi thi ghi de URL cu
  if (req.file) {
    imageUrl = await uploadFileToS3(req.file);
  }

  await productModel.updateProduct(req.params.productId, {
    name: req.body.name,
    price: req.body.price,
    unit_in_stock: req.body.unit_in_stock,
    url_image: imageUrl
  });

  res.redirect('/');
}

async function deleteProduct(req, res) {
  await productModel.deleteProduct(req.params.productId);
  res.redirect('/');
}

module.exports = {
  showList,
  showDetail,
  showCreateForm,
  createProduct,
  showEditForm,
  updateProduct,
  deleteProduct
};
