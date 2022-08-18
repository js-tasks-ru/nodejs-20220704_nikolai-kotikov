const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');
const User = require('./models/User');

function socket(server) {
  const io = socketIO(server, {
    allowEIO3: true,
  });

  io.use(async function(socket, next) {
    const token = socket.handshake.query.token;

    if (!token) {
      next(new Error('anonymous sessions are not allowed'));
    }

    const session = await Session.findOne({token});

    if (!session) {
      next(new Error('wrong or expired session token'));
    }

    socket.user = await User.findOne({token});
    next();
  });

  io.on('connection', function(socket) {
    socket.on('message', async (msg) => {
      await Message.create({
        user: socket.user.displayName,
        chat: socket.user.id,
        text: msg,
        date: new Date(),
      });
    });
  });

  return io;
}

module.exports = socket;
