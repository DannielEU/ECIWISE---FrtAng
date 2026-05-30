/** Roles disponibles en la plataforma ECIWISE+. */
export enum Role {
  Student = 'STUDENT',
  Tutor = 'TUTOR',
  Admin = 'ADMIN',
}

/** Ruta base del área principal de cada rol. */
export const ROLE_HOME: Record<Role, string> = {
  [Role.Student]: '/student',
  [Role.Tutor]: '/tutor',
  [Role.Admin]: '/admin',
};

/** Nombres de rol tal como los expone el backend (wise_auth). */
export type ApiRole = 'estudiante' | 'tutor' | 'admin';

const API_TO_ROLE: Record<ApiRole, Role> = {
  estudiante: Role.Student,
  tutor: Role.Tutor,
  admin: Role.Admin,
};

const ROLE_TO_API: Record<Role, ApiRole> = {
  [Role.Student]: 'estudiante',
  [Role.Tutor]: 'tutor',
  [Role.Admin]: 'admin',
};

/** Traduce el rol del backend (es) al enum del front. Por defecto, estudiante. */
export function roleFromApi(rol: string): Role {
  return API_TO_ROLE[rol as ApiRole] ?? Role.Student;
}

/** Traduce el enum del front al nombre de rol del backend (es). */
export function roleToApi(role: Role): ApiRole {
  return ROLE_TO_API[role];
}
