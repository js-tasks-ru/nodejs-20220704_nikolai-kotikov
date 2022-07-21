const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

class Observer {
  constructor() {
    this._init();
  }

  _init() {
    this._observers = new Set();
  }

  _clear() {
    this._init();
  }

  add(observer) {
    this._observers.add(observer);
  }

  notify(payload) {
    this._observers.forEach((observer) => observer(payload));
    this._clear();
  }
}

const observer = new Observer();

router.get('/subscribe', async (ctx, next) => {
  ctx.body = await new Promise((resolve) => {
    observer.add(resolve);
  });
  ctx.status = 200;
  return next();
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;
  if (message) {
    observer.notify(message);
    ctx.status = 200;
  }

  return next();
});

app.use(router.routes());

module.exports = app;
