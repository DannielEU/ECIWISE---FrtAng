import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthError, AuthService } from '../../../core/auth/auth.service';
import { Role } from '../../../core/models/role.enum';
import { ButtonComponent } from '../../../shared/ui/button/button';
import { IconComponent } from '../../../shared/ui/icon/icon';
import { DatosIaFieldsComponent } from '../datos-ia-fields/datos-ia-fields';
import { buildDatosIaGroup, buildDatosIaPayload } from '../datos-ia-form';

/** Valida que `newPassword` y `confirm` coincidan. */
const passwordsMatch: ValidatorFn = (group) => {
  const pw = group.get('newPassword')?.value as string;
  const confirm = group.get('confirm')?.value as string;
  return pw && confirm && pw !== confirm ? { mismatch: true } : null;
};

/**
 * Pop-up forzado (no descartable) de cambio de contraseña para cuentas creadas
 * por CSV. Pide la nueva contraseña y, si el usuario es estudiante, también sus
 * datos de IA. Al completarse, `AuthService` limpia el flag `mustChangePassword`
 * y el `AppShell` deja de mostrar este diálogo.
 */
@Component({
  selector: 'eci-force-password-change',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    ButtonComponent,
    IconComponent,
    DatosIaFieldsComponent,
  ],
  templateUrl: './force-password-change.html',
  styleUrl: './force-password-change.css',
})
export class ForcePasswordChangeComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  protected readonly loading = signal(false);
  protected readonly errorKey = signal<string | null>(null);
  protected readonly isStudent = this.auth.role() === Role.Student;

  protected readonly form = this.fb.nonNullable.group(
    {
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/),
        ],
      ],
      confirm: ['', [Validators.required]],
      datosIa: buildDatosIaGroup(this.fb),
    },
    { validators: passwordsMatch },
  );

  constructor() {
    // Solo los estudiantes completan datosIa; para el resto se deshabilita el
    // grupo (no afecta la validez ni se renderiza).
    if (!this.isStudent) {
      this.form.controls.datosIa.disable();
    }
  }

  /** Grupo de datos de IA para el componente compartido de campos. */
  protected get datosIaGroup(): FormGroup {
    return this.form.controls.datosIa;
  }

  submit(): void {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.errorKey.set(null);

    const newPassword = this.form.controls.newPassword.value;
    const datosIa = this.isStudent
      ? buildDatosIaPayload(this.form.controls.datosIa.getRawValue())
      : undefined;

    this.auth.changePassword(newPassword, datosIa).subscribe({
      // Al éxito, el flag se limpia en el estado y el AppShell oculta el diálogo.
      error: (err: unknown) => {
        this.loading.set(false);
        this.errorKey.set(err instanceof AuthError ? err.messageKey : 'errors.unknown');
      },
    });
  }
}
