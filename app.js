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

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'https://e-commerce-0ucj.onrender.com',
  'https://e-commerce-pp.onrender.com',
];


console.log(process.env.FRONTEND_URL);
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
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
