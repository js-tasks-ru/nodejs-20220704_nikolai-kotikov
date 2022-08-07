const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      const user = await User.findOne({email});
      if (user) {
        const checkPassword = await user.checkPassword(password);
        return checkPassword ? done(null, user) : done(null, false, 'Неверный пароль');
      }
      return done(null, false, 'Нет такого пользователя');
    },
);
