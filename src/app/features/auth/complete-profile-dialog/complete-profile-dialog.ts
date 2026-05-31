import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { IaDataService } from '../../../core/ia/ia-data.service';
import { IaProfileStatusService } from '../../../core/ia/ia-profile-status.service';
import { ButtonComponent } from '../../../shared/ui/button/button';
import { DatosIaFieldsComponent } from '../datos-ia-fields/datos-ia-fields';
import { buildDatosIaGroup, buildDatosIaPayload } from '../datos-ia-form';

/**
 * Pop-up no descartable que pide los datos del modelo de rendimiento. Se muestra
 * tras el registro por Google (cuentas sin esos datos) para mantener la
 * consistencia y poder calcular la predicción. Desaparece al completarse.
 */
@Component({
  selector: 'eci-complete-profile-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslatePipe, ButtonComponent, DatosIaFieldsComponent],
  templateUrl: './complete-profile-dialog.html',
  styleUrl: '../force-password-change/force-password-change.css',
})
export class CompleteProfileDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dataService = inject(IaDataService);
  private readonly status = inject(IaProfileStatusService);

  protected readonly loading = signal(false);
  protected readonly errorKey = signal<string | null>(null);
  protected readonly form = this.fb.nonNullable.group({
    datosIa: buildDatosIaGroup(this.fb),
  });

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
    const payload = buildDatosIaPayload(this.form.controls.datosIa.getRawValue());
    this.dataService.saveMyData(payload).subscribe({
      next: () => {
        // Al recargar el estado, performanceComplete pasa a true y el AppShell
        // deja de mostrar este diálogo.
        this.status.load();
      },
      error: () => {
        this.loading.set(false);
        this.errorKey.set('errors.unknown');
      },
    });
  }
}
