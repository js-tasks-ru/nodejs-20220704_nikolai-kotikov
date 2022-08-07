const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const mapOrder = require('../mappers/order');

module.exports.checkout = async function checkout(ctx, next) {
  const {product, phone, address} = ctx.request.body;
  const user = ctx.user;

  const order = await Order.create({user, product, phone, address});

  await sendMail({
    to: user.email,
    subject: 'Заказ принят',
    locals: {
      product: order.product,
      id: order.id,
    },
    template: 'order-confirmation',
  });

  ctx.body = {order: order.id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({user: ctx.user}).populate('product');
  ctx.body = {orders: orders.map(mapOrder)};
};
