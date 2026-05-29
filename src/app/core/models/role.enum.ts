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
