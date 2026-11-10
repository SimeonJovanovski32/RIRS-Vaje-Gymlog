const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;

const authRoutes = require('./routes/auth');
const vajeRoutes = require('./routes/vaje');
const nacrtiRoutes = require('./routes/nacrti');

function createApp() {
  const app = express();

  app.use(express.json());

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
      }),
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24,
      },
    })
  );

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/vaje', vajeRoutes);
  app.use('/api/nacrti', nacrtiRoutes);

  return app;
}

module.exports = createApp;
