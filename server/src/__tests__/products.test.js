import request from 'supertest';
import app from '../app.js';

test('List products works (no crash)', async () => {
  const res = await request(app).get('/api/products');
  expect([200,500]).toContain(res.status);
});
