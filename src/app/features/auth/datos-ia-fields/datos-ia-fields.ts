import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonComponent } from '../../../shared/ui/button/button';
import { IconComponent } from '../../../shared/ui/icon/icon';

/** Opción de un select codificado (valor numérico que espera el backend + clave i18n). */
interface SelectOption {
  readonly value: number;
  readonly key: string;
}

/** Una página del asistente: título i18n y los controles que valida. */
interface Page {
  readonly titleKey: string;
  readonly controls: readonly string[];
}

/**
 * Campos de datos de IA del estudiante con presentación amigable: selects con
 * texto (no códigos), ayudas descriptivas y alineación en grilla. Recibe el
 * `FormGroup` construido con `buildDatosIaGroup` y lo comparten el registro y el
 * pop-up de cambio de contraseña. En modo `paginated` reparte las preguntas en
 * pasos cortos con navegación Anterior/Siguiente.
 */
@Component({
  selector: 'eci-datos-ia-fields',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslatePipe, ButtonComponent, IconComponent],
  templateUrl: './datos-ia-fields.html',
  styleUrl: './datos-ia-fields.css',
})
export class DatosIaFieldsComponent {
  readonly group = input.required<FormGroup>();
  /** Activa la navegación por pasos (Anterior/Siguiente + botón final). */
  readonly paginated = input(false);
  /** Deshabilita el botón final mientras el contenedor guarda. */
  readonly pending = input(false);
  /** Clave i18n de error a mostrar sobre los botones de navegación. */
  readonly error = input<string | null>(null);
  /** Se emite al confirmar el último paso (tras validar la página). */
  readonly completed = output<void>();

  protected readonly genderOptions: readonly SelectOption[] = [
    { value: 0, key: 'male' },
    { value: 1, key: 'female' },
  ];
  protected readonly ethnicityOptions: readonly SelectOption[] = [
    { value: 0, key: 'caucasian' },
    { value: 1, key: 'african' },
    { value: 2, key: 'asian' },
    { value: 3, key: 'other' },
  ];
  protected readonly parentalEducationOptions: readonly SelectOption[] = [
    { value: 0, key: 'none' },
    { value: 1, key: 'highschool' },
    { value: 2, key: 'somecollege' },
    { value: 3, key: 'bachelor' },
    { value: 4, key: 'higher' },
  ];
  protected readonly parentalSupportOptions: readonly SelectOption[] = [
    { value: 0, key: 'none' },
    { value: 1, key: 'low' },
    { value: 2, key: 'moderate' },
    { value: 3, key: 'high' },
    { value: 4, key: 'veryhigh' },
  ];

  /** Preguntas sí/no (checkboxes). */
  protected readonly checks = [
    'tutoring',
    'extracurricular',
    'sports',
    'music',
    'volunteering',
  ] as const;

  /** Agrupación de las preguntas en pasos cortos y temáticos. */
  protected readonly pages: readonly Page[] = [
    {
      titleKey: 'datosIa.pages.about',
      controls: ['gender', 'ethnicity', 'parentalEducation', 'parentalSupport'],
    },
    {
      titleKey: 'datosIa.pages.study',
      controls: ['studyTimeWeekly', 'absences'],
    },
  ];

  /** Paso actual (0-based). */
  protected readonly step = signal(0);
  /** Dirección del último cambio de paso (para la animación de slide). */
  protected readonly direction = signal<'forward' | 'back'>('forward');
  protected readonly isFirst = computed(() => this.step() === 0);
  protected readonly isLast = computed(() => this.step() === this.pages.length - 1);

  /** Avanza al siguiente paso si la página actual es válida. */
  next(): void {
    if (this.validateCurrentPage() && !this.isLast()) {
      this.direction.set('forward');
      this.step.update((s) => s + 1);
    }
  }

  /** Retrocede al paso anterior. */
  back(): void {
    if (!this.isFirst()) {
      this.direction.set('back');
      this.step.update((s) => s - 1);
    }
  }

  /** Confirma el último paso: valida y emite `finish` para que el padre guarde. */
  finishStep(): void {
    if (this.validateCurrentPage()) {
      this.completed.emit();
    }
  }

  /** Clave i18n del error a mostrar bajo un campo (o null si es válido/intacto). */
  errorKeyFor(name: string): string | null {
    const control = this.group().get(name);
    if (!control || control.valid || !control.touched) {
      return null;
    }
    return control.hasError('required')
      ? 'datosIa.errors.required'
      : 'datosIa.errors.range';
  }

  /** Marca como tocados los controles del paso actual y reporta si son válidos. */
  private validateCurrentPage(): boolean {
    const formGroup = this.group();
    let valid = true;
    for (const name of this.pages[this.step()].controls) {
      const control = formGroup.get(name);
      if (control) {
        control.markAsTouched();
        valid = valid && control.valid;
      }
    }
    return valid;
  }
}
