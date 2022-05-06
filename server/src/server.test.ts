import request from 'supertest';
import server from './server';

describe('server', () => {
  const app = server();

  describe('/', () => {
    const route = '/';

    it('returns a 200 status', async () => {
      const response = await request(app).get(route);
      expect(response.statusCode).toBe(200);
    });

    it('returns cors headers', async () => {
      const response = await request(app).get(route);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.headers['access-control-allow-origin']).toBe('*');
    });
  });

  describe('/ping', () => {
    const route = '/ping';

    it('returns a 200 status', async () => {
      const response = await request(app).get(route);
      expect(response.statusCode).toBe(200);
    });

    it('returns a "application/json" content-type', async () => {
      const response = await request(app).get(route);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    });

    it('returns a "pong"', async () => {
      const response = await request(app).get(route);
      expect(response.body).toEqual({ message: 'pong' });
    });
  });
});
