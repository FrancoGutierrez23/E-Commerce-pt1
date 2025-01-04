const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 4000;

const userRoutes = require('./routes/user');
const { router: authRoutes, authenticateToken } = require('./routes/auth');
const homeRoutes = require('./routes/home');
const sellRoutes = require('./routes/sell');


app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/home', homeRoutes);
app.use('/sell', sellRoutes);


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});