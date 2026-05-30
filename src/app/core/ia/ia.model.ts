/** Las 32 variables de entrada de los modelos de IA (todas opcionales). */
export interface DatosIaInputs {
  gender: number | null;
  ethnicity: number | null;
  parentalEducation: number | null;
  studyTimeWeekly: number | null;
  absences: number | null;
  tutoring: number | null;
  parentalSupport: number | null;
  extracurricular: number | null;
  sports: number | null;
  music: number | null;
  volunteering: number | null;
  maritalStatus: number | null;
  applicationMode: number | null;
  applicationOrder: number | null;
  course: number | null;
  previousQualification: number | null;
  nacionality: number | null;
  motherQualification: number | null;
  fatherQualification: number | null;
  motherOccupation: number | null;
  fatherOccupation: number | null;
  displaced: number | null;
  educationalSpecialNeeds: number | null;
  debtor: number | null;
  tuitionFeesUpToDate: number | null;
  scholarshipHolder: number | null;
  ageAtEnrollment: number | null;
  international: number | null;
  curricularUnits1stSemCredited: number | null;
  curricularUnits1stSemEnrolled: number | null;
  curricularUnits1stSemEvaluations: number | null;
  curricularUnits1stSemApproved: number | null;
}

/** Registro de datos de IA tal como lo devuelve wise_auth (incluye predicciones). */
export interface DatosIa extends DatosIaInputs {
  prediccionRendimiento: string | null;
  prediccionDesercion: string | null;
  confianzaDesercion: number | null;
  probabilidadExito: number | null;
  fechaPrediccion: string | null;
}

/** Respuesta del servicio de rendimiento (Eciwise-IA). */
export interface PerformanceResponse {
  student_name: string;
  prediction: string;
}

/** Respuesta del servicio de deserción (ECIwise-IADropout-succes). */
export interface DropoutResponse {
  student_name: string;
  dropout_prediction: string;
  confidence_percent: number;
}

/** Resultado combinado que se persiste en wise_auth. */
export interface PrediccionResultado {
  prediccionRendimiento?: string;
  prediccionDesercion?: string;
  confianzaDesercion?: number;
  probabilidadExito?: number;
}
