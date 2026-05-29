import { DOCUMENT, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const STORAGE_KEY = 'eciwise.a11y';
const A11Y_CLASS = 'a11y-mode';

/**
 * Controla el modo de accesibilidad reforzada (alto contraste, foco visible,
 * tipografía mayor). Activable por botón o por atajo de teclado (Alt+A).
 * Persiste la preferencia y es seguro en SSR.
 */
@Injectable({ providedIn: 'root' })
export class A11yService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly _enabled = signal(false);
  readonly enabled = this._enabled.asReadonly();

  /** Lee la preferencia guardada, la aplica y registra el atajo global. */
  init(): void {
    if (!this.isBrowser) {
      return;
    }
    const stored = localStorage.getItem(STORAGE_KEY) === 'true';
    this.setEnabled(stored);
    window.addEventListener('keydown', this.handleShortcut);
  }

  toggle(): void {
    this.setEnabled(!this._enabled());
  }

  setEnabled(enabled: boolean): void {
    this._enabled.set(enabled);
    this.document.documentElement.classList.toggle(A11Y_CLASS, enabled);
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEY, String(enabled));
    }
  }

  /** Alt+A alterna el modo accesible desde cualquier parte de la app. */
  private readonly handleShortcut = (event: KeyboardEvent): void => {
    if (event.altKey && (event.key === 'a' || event.key === 'A')) {
      event.preventDefault();
      this.toggle();
    }
  };
}
