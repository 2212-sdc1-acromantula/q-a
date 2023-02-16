require('dotenv').config( { path: '../.env'});
const path = require('path');
const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const csv = require('csvtojson');
const { Question, Answer, Photo } = require('./db.js');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

// app.get('/', (req, res) => {
//   qaModel.find({}, (err, items) => {
//       if (err) {
//           console.log(err);
//       }
//       else {
//           res.json({ items: items });
//       }
//   });
// });

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) {
      console.log(err);
      return;
  }
  console.log('Connected sucessfully');

  csv()
    .fromFile('../questions.csv')
    .then((result) => {
      const questions = [];
      for (let i = 0; i < result.length; i++) {
        let obj = {};
        let question = {
          question_id: result[i]['id'],
          question_body: result[i]['body'],
          question_date: result[i]['date_written'],
          asker_name: result[i]['asker_name'],
          question_helpfulness: result[i]['helpful'],
          reported: result[i]['reported']
        }

        let index = questions.findIndex(element => element.product_id === result[i]['product_id']);

        if (index === -1) {

          obj.product_id=result[i]['product_id'];
          obj.questions=[question];
          questions.push(obj);
        } else {
          questions[index].questions.push(question);
        }
      }

      Question.insertMany(questions).then(function () {
        console.log('sucess');
      }).catch(err => {
        console.log('failed', err);
      })

    });
});

app.listen(process.env.PORT);
console.log(`Listening at http://localhost:${process.env.PORT}`);