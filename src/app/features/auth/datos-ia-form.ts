import { FormBuilder, Validators } from '@angular/forms';
import { DatosIaRegistro } from '../../core/models/user.model';

/** Valores crudos del grupo de datos de IA del registro. */
export interface DatosIaFormValue {
  gender: number | null;
  ethnicity: number | null;
  parentalEducation: number | null;
  studyTimeWeekly: number | null;
  absences: number | null;
  parentalSupport: number | null;
  tutoring: boolean;
  extracurricular: boolean;
  sports: boolean;
  music: boolean;
  volunteering: boolean;
}

/**
 * Construye el `FormGroup` de datos de IA del estudiante con todos los campos
 * obligatorios. Compartido por el registro y el cambio de contraseña forzado.
 */
export function buildDatosIaGroup(fb: FormBuilder) {
  const required = (max: number) => [
    Validators.required,
    Validators.min(0),
    Validators.max(max),
  ];
  return fb.nonNullable.group({
    gender: [null as number | null, required(1)],
    ethnicity: [null as number | null, required(3)],
    parentalEducation: [null as number | null, required(4)],
    studyTimeWeekly: [null as number | null, required(20)],
    absences: [null as number | null, required(30)],
    parentalSupport: [null as number | null, required(4)],
    tutoring: [false],
    extracurricular: [false],
    sports: [false],
    music: [false],
    volunteering: [false],
  });
}

/** Convierte los valores del formulario al payload que espera el backend. */
export function buildDatosIaPayload(d: DatosIaFormValue): DatosIaRegistro {
  return {
    gender: d.gender ?? 0,
    ethnicity: d.ethnicity ?? 0,
    parentalEducation: d.parentalEducation ?? 0,
    studyTimeWeekly: d.studyTimeWeekly ?? 0,
    absences: d.absences ?? 0,
    parentalSupport: d.parentalSupport ?? 0,
    tutoring: d.tutoring ? 1 : 0,
    extracurricular: d.extracurricular ? 1 : 0,
    sports: d.sports ? 1 : 0,
    music: d.music ? 1 : 0,
    volunteering: d.volunteering ? 1 : 0,
  };
}
