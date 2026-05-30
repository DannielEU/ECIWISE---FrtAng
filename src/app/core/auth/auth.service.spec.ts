import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, of, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { AppError } from '../errors/app-error';
import { AUTH_CONFIG } from './auth.config';
import { Role } from '../models/role.enum';

describe('AuthService', () => {
  let service: AuthService;
  let post: ReturnType<typeof vi.fn>;
  const base = 'http://api.test';

  const apiResponse = {
    access_token: 'jwt-123',
    user: {
      id: 'u1',
      email: 'ana@escuelaing.edu.co',
      nombre: 'Ana',
      apellido: 'Díaz',
      rol: 'estudiante',
      avatarUrl: null,
    },
  };

  beforeEach(() => {
    localStorage.clear();
    post = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: { post } },
        { provide: AUTH_CONFIG, useValue: { apiBaseUrl: base } },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('inicia sesión y persiste usuario + token', async () => {
    post.mockReturnValue(of(apiResponse));

    const user = await firstValueFrom(
      service.loginWithEmail({ email: 'ana@escuelaing.edu.co', password: 'Secreto1' }),
    );

    expect(post).toHaveBeenCalledTimes(1);
    const [url, body] = post.mock.calls[0];
    expect(url).toBe(`${base}/auth/login`);
    expect(body).toEqual({ email: 'ana@escuelaing.edu.co', password: 'Secreto1' });
    expect(user.role).toBe(Role.Student);
    expect(service.isAuthenticated()).toBe(true);
    expect(localStorage.getItem('eciwise.token')).toBe('jwt-123');
  });

  it('propaga el AppError normalizado por el interceptor', async () => {
    post.mockReturnValue(throwError(() => new AppError('auth.invalid')));

    let error: unknown;
    try {
      await firstValueFrom(
        service.loginWithEmail({ email: 'ana@escuelaing.edu.co', password: 'mala' }),
      );
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(AppError);
    expect((error as AppError).messageKey).toBe('auth.invalid');
    expect(service.isAuthenticated()).toBe(false);
  });

  it('registra y luego cierra sesión limpiando el almacenamiento', async () => {
    post.mockReturnValue(of(apiResponse));

    await firstValueFrom(
      service.register({
        email: 'ana@escuelaing.edu.co',
        password: 'Secreto1',
        nombre: 'Ana',
        apellido: 'Díaz',
      }),
    );
    expect(service.role()).toBe(Role.Student);

    service.logout();
    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('eciwise.token')).toBeNull();
    expect(localStorage.getItem('eciwise.session')).toBeNull();
  });

  it('completeSession mapea el rol del backend al enum del front', () => {
    const user = service.completeSession('tok', {
      id: 't1',
      email: 'tutor@escuelaing.edu.co',
      nombre: 'Tina',
      apellido: 'Tutor',
      rol: 'tutor',
    });
    expect(user.role).toBe(Role.Tutor);
  });
});
