const mongoose = require("mongoose");

let questionSchema = new mongoose.Schema({
  product_id: Number,
  questions: [{
    question_id: Number,
    question_body: String,
    question_date: Date,
    asker_name: String,
    question_helpfulness: Number,
    reported: Boolean,
  }]
});

let answerSchema = new mongoose.Schema({
  answers: {
    id: Number,
    body: String,
    date: Date,
    answerer_name: String,
    helpfulness: Number,
  }
})

let photoSchema = new mongoose.Schema({
  photos: {
      answer_id: Number,
      url: String
  }
})

const Question = new mongoose.model('question', questionSchema);
const Answer = new mongoose.model('answer', answerSchema);
const Photo = new mongoose.model('photo', photoSchema);

module.exports = { Question, Answer, Photo };

