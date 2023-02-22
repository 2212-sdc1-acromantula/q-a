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
    answers: [{
      answer_id : Number,
      body: String,
      date: Date,
      answerer_name: String,
      reported: Boolean,
      helpfulness: Number,
      photos: [{
        photo_id: Number,
        url: String
      }]
    }]
  }]
});

let getQuestions = (prodId) => {
  return Questions.find( { product_id: prodId } )
}

const Questions = mongoose.model('question', questionSchema);

module.exports = { Questions, getQuestions };

