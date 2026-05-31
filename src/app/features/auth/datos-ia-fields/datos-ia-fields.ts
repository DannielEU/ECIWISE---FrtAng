import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

/** Opción de un select codificado (valor numérico que espera el backend + clave i18n). */
interface SelectOption {
  readonly value: number;
  readonly key: string;
}

/**
 * Campos de datos de IA del estudiante con presentación amigable: selects con
 * texto (no códigos), ayudas descriptivas y alineación en grilla. Recibe el
 * `FormGroup` construido con `buildDatosIaGroup` y lo comparte el registro y el
 * pop-up de cambio de contraseña.
 */
@Component({
  selector: 'eci-datos-ia-fields',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './datos-ia-fields.html',
  styleUrl: './datos-ia-fields.css',
})
export class DatosIaFieldsComponent {
  readonly group = input.required<FormGroup>();

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
}
