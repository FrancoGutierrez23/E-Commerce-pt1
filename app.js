const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const port = 4000;

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');
const sellRoutes = require('./routes/sell');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');


app.use(bodyParser.json());
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/home', homeRoutes);
app.use('/sell', sellRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});