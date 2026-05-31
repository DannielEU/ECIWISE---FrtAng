import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

interface Option {
  readonly value: number;
  readonly key: string;
}
interface SelectField {
  readonly control: string;
  readonly options: readonly Option[];
}
interface NumberField {
  readonly control: string;
  readonly min: number;
  readonly max: number;
  readonly step: number;
}

/**
 * Campos del modelo de deserción con presentación amigable (selects con texto,
 * sí/no y numéricos con ayuda). Recibe el `FormGroup` de `buildDropoutGroup`.
 * Los catálogos institucionales se muestran resumidos (+ "Otro") con códigos
 * válidos para el modelo.
 */
@Component({
  selector: 'eci-dropout-ia-fields',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './dropout-ia-fields.html',
  styleUrl: '../datos-ia-fields/datos-ia-fields.css',
})
export class DropoutIaFieldsComponent {
  readonly group = input.required<FormGroup>();

  protected readonly yesNo: readonly Option[] = [
    { value: 1, key: 'yes' },
    { value: 0, key: 'no' },
  ];

  /** Selects con catálogos resumidos (valores = códigos válidos del modelo). */
  protected readonly selectFields: readonly SelectField[] = [
    {
      control: 'maritalStatus',
      options: [
        { value: 1, key: 'single' },
        { value: 2, key: 'married' },
        { value: 3, key: 'widower' },
        { value: 4, key: 'divorced' },
        { value: 5, key: 'union' },
        { value: 6, key: 'separated' },
      ],
    },
    {
      control: 'applicationMode',
      options: [
        { value: 1, key: 'general' },
        { value: 2, key: 'secondPhase' },
        { value: 5, key: 'special' },
        { value: 10, key: 'transfer' },
        { value: 18, key: 'other' },
      ],
    },
    {
      control: 'course',
      options: [
        { value: 4, key: 'technologies' },
        { value: 9, key: 'management' },
        { value: 12, key: 'nursing' },
        { value: 3, key: 'socialWork' },
        { value: 6, key: 'education' },
        { value: 17, key: 'other' },
      ],
    },
    {
      control: 'previousQualification',
      options: [
        { value: 1, key: 'secondary' },
        { value: 5, key: 'technical' },
        { value: 3, key: 'bachelor' },
        { value: 6, key: 'postgrad' },
        { value: 17, key: 'other' },
      ],
    },
    {
      control: 'nacionality',
      options: [
        { value: 1, key: 'local' },
        { value: 6, key: 'european' },
        { value: 13, key: 'latinAmerican' },
        { value: 21, key: 'other' },
      ],
    },
    {
      control: 'motherQualification',
      options: [
        { value: 1, key: 'none' },
        { value: 2, key: 'primary' },
        { value: 3, key: 'secondary' },
        { value: 10, key: 'technical' },
        { value: 20, key: 'higher' },
        { value: 29, key: 'other' },
      ],
    },
    {
      control: 'fatherQualification',
      options: [
        { value: 1, key: 'none' },
        { value: 2, key: 'primary' },
        { value: 3, key: 'secondary' },
        { value: 10, key: 'technical' },
        { value: 20, key: 'higher' },
        { value: 34, key: 'other' },
      ],
    },
    {
      control: 'motherOccupation',
      options: [
        { value: 2, key: 'professional' },
        { value: 3, key: 'technician' },
        { value: 4, key: 'administrative' },
        { value: 5, key: 'services' },
        { value: 7, key: 'skilled' },
        { value: 9, key: 'unskilled' },
        { value: 32, key: 'other' },
      ],
    },
    {
      control: 'fatherOccupation',
      options: [
        { value: 2, key: 'professional' },
        { value: 3, key: 'technician' },
        { value: 4, key: 'administrative' },
        { value: 5, key: 'services' },
        { value: 7, key: 'skilled' },
        { value: 9, key: 'unskilled' },
        { value: 46, key: 'other' },
      ],
    },
  ];

  /** Preguntas sí/no. */
  protected readonly yesNoFields: readonly string[] = [
    'displaced',
    'educationalSpecialNeeds',
    'debtor',
    'tuitionFeesUpToDate',
    'scholarshipHolder',
    'international',
  ];

  /** Campos genuinamente numéricos (con ayuda descriptiva). */
  protected readonly numberFields: readonly NumberField[] = [
    { control: 'ageAtEnrollment', min: 17, max: 70, step: 1 },
    { control: 'applicationOrder', min: 0, max: 9, step: 1 },
    { control: 'curricularUnits1stSemEnrolled', min: 0, max: 26, step: 1 },
    { control: 'curricularUnits1stSemApproved', min: 0, max: 26, step: 1 },
    { control: 'curricularUnits1stSemEvaluations', min: 0, max: 45, step: 1 },
    { control: 'curricularUnits1stSemCredited', min: 0, max: 20, step: 1 },
  ];
}
