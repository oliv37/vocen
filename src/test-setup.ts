import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/node';
import { resetTranslations } from './mocks/handlers';

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  resetTranslations();
});
afterAll(() => server.close());
