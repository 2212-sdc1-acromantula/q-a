require('dotenv').config( { path: '../.env'});
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { getQuestions } = require('./db.js');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
console.log('Connected successfully');

const db = mongoose.connection;

db.on('error', (error) => console.error(error));
db.once('open', () =>
  console.log('Connected to database, waiting for input...')
);


app.get('/questions/:product_id', async (req, res) => {
  const prodId = req.params.product_id;
  try {
    const qanda = await getQuestions(prodId);
    console.log(qanda);
    res.send(qanda);
  } catch (error) {
    res.status(500).send(error.message);
  }
})

app.listen(8000);
  console.log(`Listening at http://localhost:8000`);