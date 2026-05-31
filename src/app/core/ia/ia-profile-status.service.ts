import { Injectable, computed, inject, signal } from '@angular/core';
import { IaDataService } from './ia-data.service';
import { DatosIa } from './ia.model';

const PERF_KEYS = [
  'gender',
  'ethnicity',
  'parentalEducation',
  'studyTimeWeekly',
  'absences',
  'tutoring',
  'parentalSupport',
  'extracurricular',
  'sports',
  'music',
  'volunteering',
] as const;

const DROPOUT_KEYS = [
  'maritalStatus',
  'applicationMode',
  'applicationOrder',
  'course',
  'previousQualification',
  'nacionality',
  'motherQualification',
  'fatherQualification',
  'motherOccupation',
  'fatherOccupation',
  'displaced',
  'educationalSpecialNeeds',
  'debtor',
  'tuitionFeesUpToDate',
  'scholarshipHolder',
  'ageAtEnrollment',
  'international',
  'curricularUnits1stSemCredited',
  'curricularUnits1stSemEnrolled',
  'curricularUnits1stSemEvaluations',
  'curricularUnits1stSemApproved',
] as const;

function complete(data: DatosIa | null, keys: readonly string[]): boolean {
  if (!data) {
    return false;
  }
  const rec = data as unknown as Record<string, number | null>;
  return keys.every((k) => rec[k] !== null && rec[k] !== undefined);
}

/**
 * Estado del perfil de IA del estudiante autenticado. Expone si los datos de
 * cada modelo están completos para decidir cuándo mostrar el pop-up de
 * rendimiento (Google) y la sección de deserción del dashboard.
 */
@Injectable({ providedIn: 'root' })
export class IaProfileStatusService {
  private readonly dataService = inject(IaDataService);

  private readonly _data = signal<DatosIa | null>(null);
  private readonly _loaded = signal(false);

  readonly data = this._data.asReadonly();
  readonly loaded = this._loaded.asReadonly();
  readonly performanceComplete = computed(() => complete(this._data(), PERF_KEYS));
  readonly dropoutComplete = computed(() => complete(this._data(), DROPOUT_KEYS));

  /** Carga (o recarga) los datos de IA del estudiante. */
  load(): void {
    this.dataService.getMyData().subscribe({
      next: (data) => {
        this._data.set(data);
        this._loaded.set(true);
      },
      error: () => this._loaded.set(true),
    });
  }
}
