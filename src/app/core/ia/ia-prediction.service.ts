import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { IA_CONFIG } from './ia.config';
import { IaDataService } from './ia-data.service';
import { DatosIaInputs, DropoutResponse, PerformanceResponse, PrediccionResultado } from './ia.model';

/** Petición del modelo de rendimiento (snake_case, contrato de Eciwise-IA). */
interface PerformanceRequest {
  student_name: string;
  gender: number | null;
  ethnicity: number | null;
  parental_education: number | null;
  study_time_weekly: number | null;
  absences: number | null;
  tutoring: number | null;
  parental_support: number | null;
  extracurricular: number | null;
  sports: number | null;
  music: number | null;
  volunteering: number | null;
}

/** Petición del modelo de deserción (snake_case, contrato de ECIwise-IADropout-succes). */
interface DropoutRequest {
  student_name: string;
  marital_status: number | null;
  application_mode: number | null;
  application_order: number | null;
  course: number | null;
  previous_qualification: number | null;
  nacionality: number | null;
  mother_qualification: number | null;
  father_qualification: number | null;
  mother_occupation: number | null;
  father_occupation: number | null;
  displaced: number | null;
  educational_special_needs: number | null;
  debtor: number | null;
  tuition_fees_up_to_date: number | null;
  gender: number | null;
  scholarship_holder: number | null;
  age_at_enrollment: number | null;
  international: number | null;
  curricular_units_1st_sem_credited: number | null;
  curricular_units_1st_sem_enrolled: number | null;
  curricular_units_1st_sem_evaluations: number | null;
  curricular_units_1st_sem_approved: number | null;
}

/**
 * Orquesta las predicciones: llama a los dos servicios de IA (detrás de APIM) con
 * el JWT (lo añade el authInterceptor) y persiste el resultado en wise_auth.
 */
@Injectable({ providedIn: 'root' })
export class IaPredictionService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(IA_CONFIG);
  private readonly data = inject(IaDataService);

  predict(studentName: string, datos: DatosIaInputs): Observable<PrediccionResultado> {
    const performance$ = this.http.post<PerformanceResponse>(
      `${this.config.performanceApiUrl}/predictions`,
      this.toPerformanceRequest(studentName, datos),
    );
    const dropout$ = this.http.post<DropoutResponse>(
      `${this.config.dropoutApiUrl}/predictions`,
      this.toDropoutRequest(studentName, datos),
    );

    return forkJoin({ performance: performance$, dropout: dropout$ }).pipe(
      map(({ performance, dropout }): PrediccionResultado => ({
        prediccionRendimiento: performance.prediction,
        prediccionDesercion: dropout.dropout_prediction,
        confianzaDesercion: dropout.confidence_percent,
      })),
      switchMap((result) => this.data.savePrediction(result).pipe(map(() => result))),
    );
  }

  private toPerformanceRequest(name: string, d: DatosIaInputs): PerformanceRequest {
    return {
      student_name: name,
      gender: d.gender,
      ethnicity: d.ethnicity,
      parental_education: d.parentalEducation,
      study_time_weekly: d.studyTimeWeekly,
      absences: d.absences,
      tutoring: d.tutoring,
      parental_support: d.parentalSupport,
      extracurricular: d.extracurricular,
      sports: d.sports,
      music: d.music,
      volunteering: d.volunteering,
    };
  }

  private toDropoutRequest(name: string, d: DatosIaInputs): DropoutRequest {
    return {
      student_name: name,
      marital_status: d.maritalStatus,
      application_mode: d.applicationMode,
      application_order: d.applicationOrder,
      course: d.course,
      previous_qualification: d.previousQualification,
      nacionality: d.nacionality,
      mother_qualification: d.motherQualification,
      father_qualification: d.fatherQualification,
      mother_occupation: d.motherOccupation,
      father_occupation: d.fatherOccupation,
      displaced: d.displaced,
      educational_special_needs: d.educationalSpecialNeeds,
      debtor: d.debtor,
      tuition_fees_up_to_date: d.tuitionFeesUpToDate,
      gender: d.gender,
      scholarship_holder: d.scholarshipHolder,
      age_at_enrollment: d.ageAtEnrollment,
      international: d.international,
      curricular_units_1st_sem_credited: d.curricularUnits1stSemCredited,
      curricular_units_1st_sem_enrolled: d.curricularUnits1stSemEnrolled,
      curricular_units_1st_sem_evaluations: d.curricularUnits1stSemEvaluations,
      curricular_units_1st_sem_approved: d.curricularUnits1stSemApproved,
    };
  }
}
