const {v4: uuid} = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const token = uuid();
  const {email, displayName, password} = ctx.request.body;

  try {
    const user = await User.create({
      email,
      displayName,
      verificationToken: token,
    });
    await user.setPassword(password);
    await user.save();
    await sendMail({
      template: 'confirmation',
      locals: {token: 'token'},
      to: email,
      subject: 'Подтвердите почту',
    });
    ctx.status = 200;
    ctx.body = {status: 'ok'};
  } catch (e) {
    ctx.throw(400, e);
  }
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;
  try {
    const user = await User.findOne({verificationToken});

    if (!user) {
      ctx.status = 400;
      ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
      return;
    }
    user.verificationToken = undefined;
    await user.save();

    const token = await ctx.login(user);
    ctx.status = 200;
    ctx.body = {token};
  } catch (err) {
    ctx.throw(400, err);
  }
};
