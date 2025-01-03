const express = require('express');
const app = express();
const port = 4000;

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');


app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.use('/users', userRoutes);
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});