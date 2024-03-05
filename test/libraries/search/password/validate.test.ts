import { randomBytes } from 'crypto';

describe('Hex Key', () => {
  const randomKey = randomBytes(8).toString('hex');

  test('Random Key', () => {
    expect(randomKey).toBeDefined();
  });
});
