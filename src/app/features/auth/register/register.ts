import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthError, AuthService } from '../../../core/auth/auth.service';
import { ROLE_HOME } from '../../../core/models/role.enum';
import { RegisterRequest, User } from '../../../core/models/user.model';
import { buildDatosIaGroup, buildDatosIaPayload } from '../datos-ia-form';
import { ButtonComponent } from '../../../shared/ui/button/button';
import { DatosIaFieldsComponent } from '../datos-ia-fields/datos-ia-fields';
import { LogoComponent } from '../../../shared/ui/logo/logo';
import { SpaceBackgroundComponent } from '../../../shared/ui/space-background/space-background';
import { ThemeToggleComponent } from '../../../core/theme/theme-toggle';
import { LanguageSwitchComponent } from '../../../core/i18n/language-switch';
import { A11yToggleComponent } from '../../../core/a11y/a11y-toggle';

/** Dominios de correo permitidos para el registro (deben coincidir con el backend). */
const ALLOWED_EMAIL_DOMAINS = ['gmail.com', 'escuelaing.edu.co', 'mail.escuelaing.edu.co'];

/** Validador que exige que el correo pertenezca a un dominio permitido. */
function allowedEmailDomainValidator(control: AbstractControl): ValidationErrors | null {
  const value = (control.value as string | null)?.trim().toLowerCase();
  if (!value) {
    return null;
  }
  const domain = value.slice(value.lastIndexOf('@') + 1);
  return ALLOWED_EMAIL_DOMAINS.includes(domain) ? null : { emailDomain: true };
}

/** Registro de un nuevo estudiante (correo + datos básicos para la IA). */
@Component({
  selector: 'eci-register',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
    ButtonComponent,
    DatosIaFieldsComponent,
    LogoComponent,
    SpaceBackgroundComponent,
    ThemeToggleComponent,
    LanguageSwitchComponent,
    A11yToggleComponent,
  ],
  templateUrl: './register.html',
  styleUrl: '../auth.css',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly loading = signal(false);
  protected readonly errorKey = signal<string | null>(null);
  /** Paso actual del asistente (1: datos personales, 2: datos para la IA). */
  protected readonly step = signal<1 | 2>(1);

  /** Campos que se validan antes de avanzar al segundo paso. */
  private readonly step1Controls = ['nombre', 'apellido', 'email', 'telefono', 'password'] as const;

  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email, allowedEmailDomainValidator]],
    telefono: [''],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/),
      ],
    ],
    datosIa: buildDatosIaGroup(this.fb),
  });

  /** Grupo de datos de IA para el componente compartido de campos. */
  protected get datosIaGroup(): FormGroup {
    return this.form.controls.datosIa;
  }

  /** Clave i18n del error a mostrar bajo un campo del paso 1 (o null si es válido). */
  errorKeyFor(name: string): string | null {
    const control = this.form.get(name);
    if (!control || control.valid || !control.touched) {
      return null;
    }
    if (control.hasError('email')) {
      return 'register.errors.email';
    }
    if (control.hasError('emailDomain')) {
      return 'register.errors.emailDomain';
    }
    if (name === 'password') {
      return 'register.errors.password';
    }
    return 'register.errors.required';
  }

  /** Avanza al paso de datos de IA si los datos personales son válidos. */
  next(): void {
    const ok = this.step1Controls.every((name) => this.form.controls[name].valid);
    if (!ok) {
      this.step1Controls.forEach((name) => this.form.controls[name].markAsTouched());
      return;
    }
    this.errorKey.set(null);
    this.step.set(2);
  }

  /** Regresa al paso de datos personales. */
  back(): void {
    this.step.set(1);
  }

  submit(): void {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.errorKey.set(null);
    this.auth.register(this.buildRequest()).subscribe({
      next: (user: User) => void this.router.navigateByUrl(ROLE_HOME[user.role]),
      error: (err: unknown) => this.fail(err),
    });
  }

  private fail(err: unknown): void {
    this.loading.set(false);
    const key = err instanceof AuthError ? err.messageKey : 'errors.unknown';
    this.errorKey.set(key);
    // El correo se edita en el primer paso: si está en uso o su dominio no se
    // permite, regresamos allí para que el usuario pueda corregirlo.
    if (key === 'auth.emailTaken' || key === 'auth.emailDomainNotAllowed') {
      this.step.set(1);
    }
  }

  private buildRequest(): RegisterRequest {
    const value = this.form.getRawValue();
    return {
      email: value.email,
      password: value.password,
      nombre: value.nombre,
      apellido: value.apellido,
      telefono: value.telefono.trim() || undefined,
      datosIa: buildDatosIaPayload(value.datosIa),
    };
  }
}
