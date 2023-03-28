import { JwtMiddleware } from './middleware-auth.middleware';

describe('MiddlewareAuthMiddleware', () => {
  it('should be defined', () => {
    expect(new JwtMiddleware()).toBeDefined();
  });
});
