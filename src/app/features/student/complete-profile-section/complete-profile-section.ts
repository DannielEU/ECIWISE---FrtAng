import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { IaDataService } from '../../../core/ia/ia-data.service';
import { IaProfileStatusService } from '../../../core/ia/ia-profile-status.service';
import { CardComponent } from '../../../shared/ui/card/card';
import { ButtonComponent } from '../../../shared/ui/button/button';
import { DropoutIaFieldsComponent } from '../../auth/dropout-ia-fields/dropout-ia-fields';
import { buildDropoutGroup, buildDropoutPayload } from '../../auth/dropout-ia-form';

/**
 * Sección inicial del dashboard del estudiante para completar los datos del
 * modelo de deserción. Aparece solo cuando ya tiene los datos de rendimiento y
 * aún no completa los de deserción; desaparece al guardarlos.
 */
@Component({
  selector: 'eci-complete-profile-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, CardComponent, ButtonComponent, DropoutIaFieldsComponent],
  templateUrl: './complete-profile-section.html',
  styleUrl: './complete-profile-section.css',
})
export class CompleteProfileSectionComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dataService = inject(IaDataService);
  private readonly status = inject(IaProfileStatusService);

  protected readonly saving = signal(false);
  /** El formulario solo se muestra al entrar al aviso. */
  protected readonly expanded = signal(false);
  protected readonly form = this.fb.nonNullable.group({
    dropout: buildDropoutGroup(this.fb),
  });

  /** Visible solo si ya completó rendimiento pero falta deserción. */
  protected readonly show = computed(
    () =>
      this.status.loaded() &&
      this.status.performanceComplete() &&
      !this.status.dropoutComplete(),
  );

  protected get dropoutGroup(): FormGroup {
    return this.form.controls.dropout;
  }

  constructor() {
    if (!this.status.loaded()) {
      this.status.load();
    }
  }

  start(): void {
    this.expanded.set(true);
  }

  submit(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const payload = buildDropoutPayload(this.form.controls.dropout.getRawValue());
    this.dataService.saveMyData(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.status.load(); // al completarse, `show` pasa a false y se oculta
      },
      error: () => this.saving.set(false),
    });
  }
}
