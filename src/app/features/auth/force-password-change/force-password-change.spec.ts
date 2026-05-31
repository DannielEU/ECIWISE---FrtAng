import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ForcePasswordChangeComponent } from './force-password-change';
import { AuthService } from '../../../core/auth/auth.service';
import { Role } from '../../../core/models/role.enum';
import { StaticTranslateLoader } from '../../../core/i18n/static-translate.loader';

interface ChangeCall {
  newPassword: string;
  datosIa: unknown;
}

const DATOS_IA = {
  gender: 1,
  ethnicity: 0,
  parentalEducation: 2,
  studyTimeWeekly: 10,
  absences: 2,
  parentalSupport: 3,
};

describe('ForcePasswordChangeComponent', () => {
  let calls: ChangeCall[];
  let currentRole: Role;

  const mockAuth = {
    role: () => currentRole,
    changePassword: (newPassword: string, datosIa?: unknown) => {
      calls.push({ newPassword, datosIa });
      return of(undefined);
    },
  };

  const create = async (role: Role): Promise<ComponentFixture<ForcePasswordChangeComponent>> => {
    currentRole = role;
    calls = [];
    await TestBed.configureTestingModule({
      imports: [ForcePasswordChangeComponent],
      providers: [
        provideTranslateService({
          loader: { provide: TranslateLoader, useClass: StaticTranslateLoader },
          fallbackLang: 'es',
          lang: 'es',
        }),
        { provide: AuthService, useValue: mockAuth },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(ForcePasswordChangeComponent);
    fixture.detectChanges();
    return fixture;
  };

  // Acceso a la signal `form` protegida para preparar valores en las pruebas.
  const formOf = (fixture: ComponentFixture<ForcePasswordChangeComponent>) =>
    (fixture.componentInstance as unknown as { form: any }).form;

  it('muestra los datos de estudiante solo para el rol estudiante', async () => {
    const studentFixture = await create(Role.Student);
    expect(
      (studentFixture.nativeElement as HTMLElement).querySelector('.fpc__group'),
    ).not.toBeNull();
    TestBed.resetTestingModule();

    const tutorFixture = await create(Role.Tutor);
    expect(
      (tutorFixture.nativeElement as HTMLElement).querySelector('.fpc__group'),
    ).toBeNull();
  });

  it('no envía si el formulario es inválido', async () => {
    const fixture = await create(Role.Tutor);
    fixture.componentInstance.submit();
    expect(calls.length).toBe(0);
  });

  it('no envía si las contraseñas no coinciden', async () => {
    const fixture = await create(Role.Tutor);
    formOf(fixture).patchValue({ newPassword: 'abcd1234', confirm: 'otra1234' });
    fixture.componentInstance.submit();
    expect(calls.length).toBe(0);
  });

  it('envía contraseña + datosIa para estudiante', async () => {
    const fixture = await create(Role.Student);
    formOf(fixture).patchValue({
      newPassword: 'abcd1234',
      confirm: 'abcd1234',
      datosIa: {
        ...DATOS_IA,
        tutoring: true,
        extracurricular: false,
        sports: true,
        music: false,
        volunteering: false,
      },
    });
    fixture.componentInstance.submit();

    expect(calls.length).toBe(1);
    expect(calls[0].newPassword).toBe('abcd1234');
    expect(calls[0].datosIa).toEqual({
      ...DATOS_IA,
      tutoring: 1,
      extracurricular: 0,
      sports: 1,
      music: 0,
      volunteering: 0,
    });
  });

  it('para tutor envía sin datosIa', async () => {
    const fixture = await create(Role.Tutor);
    formOf(fixture).patchValue({ newPassword: 'abcd1234', confirm: 'abcd1234' });
    fixture.componentInstance.submit();

    expect(calls.length).toBe(1);
    expect(calls[0].datosIa).toBeUndefined();
  });
});
