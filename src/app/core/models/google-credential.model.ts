/** Respuesta de credencial emitida por Google Identity Services (GIS). */
export interface GoogleCredentialResponse {
  readonly credential: string;
  readonly select_by?: string;
}

/** Claims relevantes del JWT de Google una vez decodificado. */
export interface GoogleJwtClaims {
  readonly sub: string;
  readonly email: string;
  readonly name: string;
  readonly picture?: string;
  readonly email_verified?: boolean;
}
