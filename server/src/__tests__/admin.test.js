import request from 'supertest';
import app from '../app.js';

test('Admin stats require auth', async () => {
  const res = await request(app).get('/api/admin/stats');
  expect([401,403]).toContain(res.status);
});
