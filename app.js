const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 4000;

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/home', homeRoutes);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});