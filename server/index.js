require('dotenv').config( { path: '../.env'});
const path = require('path');
const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const csv = require('fast-csv');
const { Questions, getQuestions} = require('./db.js');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

const questionCsv = '../questions.csv';
const answersCsv = '../answers.csv';
const photoCsv = '../answers_photos.csv';

mongoose.set('strictQuery', false);

async function importQuestions() {
  let batch = [];

  const questions = fs.createReadStream(questionCsv).pipe(csv.parse({ headers: true }));

  for await (const question of questions) {
    const q = {
      question_id: question['id'],
      question_body: question['body'],
      question_date: question['date_written'],
      asker_name: question['asker_name'],
      question_helpfulness: question['helpful'],
      reported: question['reported'],
      answers: []
    };

    let index = batch.findIndex(element => element.product_id === question['product_id']);
    if (index === -1) {
      batch.push({
        product_id: question['product_id'],
        questions: [q]
      });
    } else {
      batch[index].questions.push(q);
    }

    if (batch.length === 10000) {
      try {
        await Questions.create(batch);
        console.log('Imported questions successfully');
      } catch (error) {
        console.log(error);
      }
      batch = [];
    }
  }

  if (batch.length > 0) {
    try {
      await Questions.create(batch);
      console.log('Imported questions successfully');
    } catch (error) {
      console.log(error);
    }
  }
}

async function importAnswers() {
  const answers = fs.createReadStream(answersCsv).pipe(csv.parse({ headers: true }));

  for await (const answer of answers) {
    const ans = {
      answer_id: answer['id'],
      body: answer['body'],
      date: answer['date_written'],
      answerer_name: answer['answerer_name'],
      reported: answer['reported'],
      helpfulness: answer['helpful'],
    }
    let questionExists = await Questions.findOne({ questions: { $elemMatch: { question_id: answer['question_id']}} });
    if (questionExists) {
      await Questions.updateOne(
        { questions: { $elemMatch: { question_id: answer['question_id'] } } },
        { $push: { 'questions.$.answers': ans } }
      );
    }
  }
}

async function importPhotos() {
  const photos = fs.createReadStream(photoCsv).pipe(csv.parse({ headers: true }));

  for await (const photo of photos) {
    const pho = {
      photo_id: photo['id'],
      url: photo['url']
    }
    const answerExists = await Questions.findOne({
      'questions.answers.answer_id': photo['answer_id']
    });
    if (answerExists) {
      await Questions.updateOne({
        'questions.answers.answer_id': photo['answer_id']
      }, {
        $push: {
          'questions.$[].answers.$[answer].photos': pho
        }
      }, {
        arrayFilters: [{
          'answer.answer_id': photo['answer_id']
        }]
      })
    }
  }
}

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected successfully');
    console.time('process');
    await importQuestions();
    await importAnswers();
    await importPhotos();
  } catch (error) {
    console.log('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed');
    console.timeEnd('process');
  }
})();

  app.listen(process.env.PORT);
  console.log(`Listening at http://localhost:${process.env.PORT}`);