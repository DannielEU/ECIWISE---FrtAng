import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthError, AuthService } from '../../../core/auth/auth.service';
import { IaDataService } from '../../../core/ia/ia-data.service';
import { IaPredictionService } from '../../../core/ia/ia-prediction.service';
import { IA_FIELDS } from '../../../core/ia/ia-fields';
import { DatosIa, DatosIaInputs, PrediccionResultado } from '../../../core/ia/ia.model';
import { ButtonComponent } from '../../../shared/ui/button/button';

type IaForm = FormGroup<Record<string, FormControl<number | null>>>;

/** Formulario dedicado para los datos de IA del estudiante y cálculo de predicción. */
@Component({
  selector: 'eci-ia-perfil',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslatePipe, ButtonComponent],
  templateUrl: './ia-perfil.html',
  styleUrl: './ia-perfil.css',
})
export class IaPerfilComponent implements OnInit {
  private readonly dataService = inject(IaDataService);
  private readonly prediction = inject(IaPredictionService);
  private readonly auth = inject(AuthService);

  protected readonly performanceFields = IA_FIELDS.filter((f) => f.section === 'performance');
  protected readonly dropoutFields = IA_FIELDS.filter((f) => f.section === 'dropout');

  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly predicting = signal(false);
  protected readonly saved = signal(false);
  protected readonly errorKey = signal<string | null>(null);
  protected readonly result = signal<PrediccionResultado | null>(null);

  protected readonly form: IaForm = this.buildForm();

  ngOnInit(): void {
    this.dataService.getMyData().subscribe({
      next: (data) => {
        if (data) {
          this.patch(data);
        }
        this.loading.set(false);
      },
      error: (err: unknown) => this.fail(err, true),
    });
  }

  save(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.saved.set(false);
    this.errorKey.set(null);
    this.dataService.saveMyData(this.currentInputs()).subscribe({
      next: () => {
        this.saving.set(false);
        this.saved.set(true);
      },
      error: (err: unknown) => this.fail(err),
    });
  }

  predict(): void {
    const inputs = this.currentInputs();
    if (this.predicting()) {
      return;
    }
    if (!this.isComplete(inputs)) {
      this.errorKey.set('ia.profile.incomplete');
      return;
    }
    this.predicting.set(true);
    this.errorKey.set(null);
    this.prediction.predict(this.auth.user()?.name ?? '', inputs).subscribe({
      next: (res) => {
        this.result.set(res);
        this.predicting.set(false);
      },
      error: (err: unknown) => this.fail(err),
    });
  }

  private buildForm(): IaForm {
    const controls: Record<string, FormControl<number | null>> = {};
    for (const field of IA_FIELDS) {
      controls[field.key] = new FormControl<number | null>(null, [
        Validators.min(field.min),
        Validators.max(field.max),
      ]);
    }
    return new FormGroup(controls);
  }

  private patch(data: DatosIa): void {
    const patch: Record<string, number | null> = {};
    for (const field of IA_FIELDS) {
      patch[field.key] = data[field.key];
    }
    this.form.patchValue(patch);
  }

  private currentInputs(): DatosIaInputs {
    return this.form.getRawValue() as unknown as DatosIaInputs;
  }

  private isComplete(d: DatosIaInputs): boolean {
    return IA_FIELDS.every((field) => d[field.key] !== null && d[field.key] !== undefined);
  }

  private fail(err: unknown, stopLoading = false): void {
    this.saving.set(false);
    this.predicting.set(false);
    if (stopLoading) {
      this.loading.set(false);
    }
    this.errorKey.set(err instanceof AuthError ? err.messageKey : 'errors.unknown');
  }
}
