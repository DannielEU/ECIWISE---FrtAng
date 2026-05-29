import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Contenedor de superficie reutilizable con estilo institucional. */
@Component({
  selector: 'eci-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styles: [
    `
      :host {
        display: block;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: var(--space-6);
        box-shadow: var(--shadow-sm);
      }
    `,
  ],
})
export class CardComponent {}
