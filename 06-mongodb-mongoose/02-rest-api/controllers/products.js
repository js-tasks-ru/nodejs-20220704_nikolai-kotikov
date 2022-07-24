const mongoose = require('mongoose');
const Product = require('../models/Product');
const mapProduct = require('../mappers/product');

const ObjectId = mongoose.Types.ObjectId;

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  const products = await Product.find({subcategory});

  ctx.body = {products: products.map(mapProduct)};
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find({});
  ctx.body = {products: products.map(mapProduct)};
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.params.id;
  if (!ObjectId.isValid(id)) {
    ctx.throw(400, 'Bad Request');
  }
  const product = await Product.findById(id);

  if (!product) {
    ctx.throw(404, 'Not Found');
  }
  ctx.body = {product: mapProduct(product)};
};
