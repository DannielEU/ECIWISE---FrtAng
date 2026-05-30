import { InjectionToken } from '@angular/core';

/** URLs de los dos servicios de predicción de IA (detrás de Azure API Management). */
export interface IaConfig {
  /** Servicio de rendimiento académico (Eciwise-IA). Sin barra final. */
  readonly performanceApiUrl: string;
  /** Servicio de deserción (ECIwise-IADropout-succes). Sin barra final. */
  readonly dropoutApiUrl: string;
}

export const IA_CONFIG = new InjectionToken<IaConfig>('IA_CONFIG', {
  providedIn: 'root',
  factory: () => ({
    performanceApiUrl: 'http://localhost:8001',
    dropoutApiUrl: 'http://localhost:8002',
  }),
});
