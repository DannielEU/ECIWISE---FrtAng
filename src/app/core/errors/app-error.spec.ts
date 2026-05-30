import { HttpErrorResponse } from '@angular/common/http';
import { AppError, httpErrorToKey } from './app-error';

describe('httpErrorToKey', () => {
  const withBody = (status: number, body: unknown) =>
    new HttpErrorResponse({ status, error: body });

  it('mapea status 0 (sin red) a errors.network', () => {
    expect(httpErrorToKey(withBody(0, null))).toBe('errors.network');
  });

  it('mapea el código del backend email_taken a auth.emailTaken', () => {
    expect(httpErrorToKey(withBody(409, { message: 'email_taken' }))).toBe('auth.emailTaken');
  });

  it('mapea invalid_credentials a auth.invalid', () => {
    expect(httpErrorToKey(withBody(401, { message: 'invalid_credentials' }))).toBe('auth.invalid');
  });

  it('mapea account_suspended a auth.suspended', () => {
    expect(httpErrorToKey(withBody(400, { message: 'account_suspended' }))).toBe('auth.suspended');
  });

  it('mapea 429 a errors.tooMany', () => {
    expect(httpErrorToKey(withBody(429, { message: 'too_many_requests' }))).toBe('errors.tooMany');
  });

  it('mapea 500 a errors.server', () => {
    expect(httpErrorToKey(withBody(500, 'boom'))).toBe('errors.server');
  });

  it('mapea errores no HTTP a errors.unknown', () => {
    expect(httpErrorToKey(new Error('x'))).toBe('errors.unknown');
  });

  it('AppError conserva la clave de traducción', () => {
    expect(new AppError('auth.invalid').messageKey).toBe('auth.invalid');
  });
});
