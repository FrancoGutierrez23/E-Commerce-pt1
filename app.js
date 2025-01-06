const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 4000;

const userRoutes = require('./routes/user');
const { router: authRoutes, authenticateToken } = require('./routes/auth');
const homeRoutes = require('./routes/home');
const sellRoutes = require('./routes/sell');
const cartRoutes = require('./routes/cart');


app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/home', homeRoutes);
app.use('/sell', sellRoutes);
app.use('/cart', cartRoutes);


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});