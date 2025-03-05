import { type TokenAction } from '@/db/schema';

import { getBaseUrlByHeaders } from './host';
import { buildUserActionUrl } from './url';

jest.mock('./host', () => ({
  getBaseUrlByHeaders: jest.fn(),
}));

describe('buildUserActionUrl', () => {
  beforeEach(() => {
    (getBaseUrlByHeaders as jest.Mock).mockReturnValue('http://127.0.0.1:3000');
  });

  it('should build a user action URL correctly', () => {
    const token = 'qcyrL4bTMV132WXvULSyKQ_AGydySali';
    const searchParams = new URLSearchParams({ token });
    const tokenAction: TokenAction = 'reset-password';

    const expectedUrl = `http://127.0.0.1:3000/${tokenAction}?token=${token}`;
    const result = buildUserActionUrl({ searchParams, tokenAction });

    expect(result).toBe(expectedUrl);
  });
});
