import { Role } from './role.enum';

/** Usuario autenticado de la plataforma (modelo del front). */
export interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: Role;
  readonly active: boolean;
  readonly avatarUrl?: string;
  /** Programa académico o dependencia. */
  readonly program?: string;
}

/** Credenciales para el login integrado por correo. */
export interface EmailCredentials {
  readonly email: string;
  readonly password: string;
}

/**
 * Subconjunto del modelo de rendimiento que se captura en el registro.
 * Todos los campos son opcionales; el resto se completa en el perfil de IA.
 */
export interface DatosIaRegistro {
  studyTimeWeekly?: number;
  absences?: number;
  tutoring?: number;
  parentalSupport?: number;
  extracurricular?: number;
  sports?: number;
  music?: number;
  volunteering?: number;
}

/** Cuerpo de la petición de registro integrado (debe coincidir con el DTO del backend). */
export interface RegisterRequest {
  readonly email: string;
  readonly password: string;
  readonly nombre: string;
  readonly apellido: string;
  readonly telefono?: string;
  readonly datosIa?: DatosIaRegistro;
}

/** Usuario tal como lo devuelve el backend. */
export interface ApiUser {
  readonly id: string;
  readonly email: string;
  readonly nombre: string;
  readonly apellido: string;
  readonly rol: string;
  readonly avatarUrl?: string | null;
}

/** Respuesta de autenticación del backend (login, registro y callback de Google). */
export interface AuthResponse {
  readonly access_token: string;
  readonly user: ApiUser;
}
