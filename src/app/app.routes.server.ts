import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * La landing pública se prerenderiza. Las áreas autenticadas dependen de
 * estado del navegador (sesión, WebGL), por lo que se renderizan en cliente
 * para evitar redirecciones de guards durante el prerender.
 */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Client },
];
