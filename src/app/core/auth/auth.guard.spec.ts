import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { authGuard, roleGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Role } from '../models/role.enum';

function runAuthGuard(url: string): boolean | UrlTree {
  const state = { url } as RouterStateSnapshot;
  const route = {} as ActivatedRouteSnapshot;
  return TestBed.runInInjectionContext(() => authGuard(route, state)) as boolean | UrlTree;
}

function runRoleGuard(role: Role): boolean | UrlTree {
  const route = { data: { role } } as unknown as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;
  return TestBed.runInInjectionContext(() => roleGuard(route, state)) as boolean | UrlTree;
}

describe('auth guards', () => {
  let auth: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    auth = TestBed.inject(AuthService);
  });

  it('authGuard redirige al login cuando no hay sesión', () => {
    const result = runAuthGuard('/student');
    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toContain('/auth/login');
    expect((result as UrlTree).toString()).toContain('redirect');
  });

  it('authGuard permite el acceso con sesión activa', async () => {
    await firstValueFrom(
      auth.loginWithEmail({ email: 'estudiante@escuelaing.edu.co', password: 'eciwise' }),
    );
    expect(runAuthGuard('/student')).toBe(true);
  });

  it('roleGuard bloquea un rol distinto y redirige al inicio del rol propio', async () => {
    await firstValueFrom(
      auth.loginWithEmail({ email: 'estudiante@escuelaing.edu.co', password: 'eciwise' }),
    );
    expect(runRoleGuard(Role.Student)).toBe(true);

    const denied = runRoleGuard(Role.Admin);
    expect(denied).toBeInstanceOf(UrlTree);
    expect((denied as UrlTree).toString()).toContain('/student');
  });
});
