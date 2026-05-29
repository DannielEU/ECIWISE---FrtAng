import { Role } from './role.enum';

/** Usuario autenticado de la plataforma. */
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

/** Credenciales para el login tradicional por correo. */
export interface EmailCredentials {
  readonly email: string;
  readonly password: string;
}

/** Datos para el registro de un nuevo estudiante. */
export interface RegisterPayload {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly program?: string;
}
