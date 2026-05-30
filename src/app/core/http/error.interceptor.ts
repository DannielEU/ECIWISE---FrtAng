import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AppError, httpErrorToKey } from '../errors/app-error';

/**
 * Normaliza todos los errores HTTP a un {@link AppError} con una clave de
 * traducción. Así los componentes muestran el mensaje según el idioma activo y
 * nunca renderizan texto crudo del backend.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((err: unknown) => throwError(() => new AppError(httpErrorToKey(err)))),
  );
