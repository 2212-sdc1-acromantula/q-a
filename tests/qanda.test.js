require('dotenv').config();
const path = require('path');
const routes = require('../server/routes');
const request = require('supertest');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

jest.setTimeout(10000)

beforeEach(async () => {
  await mongoose.connect(process.env.MONGO_URL);
});

afterEach(async () => {
  await mongoose.connection.close();
})

describe('Get /questions/productId', () => {
  it('should return a 200 and have length greater than 0', async () => {
    const res = await request(routes).get('/questions/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should respond with an array of qandas', async () => {
    const prodId = Math.floor(Math.random() * 1000000) + 1;
    const res = await request(routes).get(`/questions/${prodId}`);
    expect(res.body[0].product_id).toEqual(prodId);
  });

  it('should return 404 if product_id does not exist', async () => {
    const res = await request(routes).get('/qanda');
    expect(res.statusCode).toBe(404);
  });
});

describe('Get /questions/productId/answers', () => {
  it('should return a 200', async () => {
    const questionId = Math.floor(Math.random() * 1000000) + 1;
    const res = await request(routes).get(`/questions/${questionId}/answers`);
    expect(res.statusCode).toBe(200);
  });

  it('should respond with an array of answers', async () => {
    const questionId = Math.floor(Math.random() * 1000000) + 1;
    const res = await request(routes).get(`/questions/${questionId}/answers`);
    expect(Array.isArray(res.body)).toEqual(true);
  });

  it('should return 404 if question_id does not exist', async () => {
    const res = await request(routes).get('/qanda');
    expect(res.statusCode).toBe(404);
  });
});

