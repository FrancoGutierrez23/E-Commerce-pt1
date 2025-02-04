const express = require('express');
const session = require('express-session');
const passport = require('./routes/config/passport');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
require("dotenv").config();
const pgSession = require('connect-pg-simple')(session);
const db = require('./db/index');

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');
const sellRoutes = require('./routes/sell');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const checkoutRoutes = require('./routes/checkout');


app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}


app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(
  session({
    store: new pgSession({
      pool: db.pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 10, // Session expires in 10 hours
    },
  })
);

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'Unauthorized' });
};

// Example protected route
app.get('/protected', isAuthenticated, (req, res) => {
  res.json({ message: 'You are authenticated', user: req.user });
});

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/home',homeRoutes);
app.use('/sell', sellRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/checkout', checkoutRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
