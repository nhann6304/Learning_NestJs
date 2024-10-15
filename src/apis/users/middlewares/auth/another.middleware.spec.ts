import { AnotherMiddleware } from './auth.middleware';

describe('AnotherMiddleware', () => {
  it('should be defined', () => {
    expect(new AnotherMiddleware()).toBeDefined();
  });
});
