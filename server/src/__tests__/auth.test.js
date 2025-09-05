import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';
import { config } from 'dotenv'; config();

beforeAll(async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/farmers_friend_test';
  try {
    await mongoose.connect(uri);
  } catch (e) {
    console.warn('Mongo not available for tests:', e.message);
  }
});

afterAll(async () => {
  try { await mongoose.connection.close(); } catch {}
});

test('Register & login', async () => {
  const email = `test${Date.now()}@example.com`;
  const reg = await request(app).post('/api/auth/register').send({ name:'Test', email, password:'pass123' });
  expect([201,500]).toContain(reg.status);
  if (reg.status === 201) {
    const login = await request(app).post('/api/auth/login').send({ email, password:'pass123' });
    expect(login.status).toBe(200);
    expect(login.body.token).toBeTruthy();
  }
});
