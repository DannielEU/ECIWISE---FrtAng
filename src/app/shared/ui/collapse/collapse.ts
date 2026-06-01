import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

/**
 * Sección colapsable con transición suave de apertura/cierre. Sustituye a los
 * `<details>` nativos (que no animan) usando la técnica `grid-template-rows:
 * 0fr → 1fr`. El encabezado lo da `summary` (texto ya traducido) y el contenido
 * se proyecta con `<ng-content>`. Respeta `prefers-reduced-motion`.
 */
@Component({
  selector: 'eci-collapse',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.is-open]': 'open()' },
  template: `
    <button
      type="button"
      class="eci-collapse__summary"
      [attr.aria-expanded]="open()"
      (click)="toggle()"
    >
      <span class="eci-collapse__marker" aria-hidden="true"></span>
      <span>{{ summary() }}</span>
    </button>
    <div class="eci-collapse__region">
      <div class="eci-collapse__content">
        <ng-content />
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        font-size: 0.78rem;
      }

      .eci-collapse__summary {
        display: inline-flex;
        align-items: center;
        gap: var(--space-1);
        width: fit-content;
        padding: 0;
        border: 0;
        background: transparent;
        color: var(--accent);
        font: inherit;
        font-weight: 600;
        cursor: pointer;
      }

      .eci-collapse__marker {
        display: inline-flex;
        width: 1rem;
        justify-content: center;
      }

      .eci-collapse__marker::before {
        content: '＋';
      }

      :host(.is-open) .eci-collapse__marker::before {
        content: '－';
      }

      /* La fila pasa de 0fr a 1fr para animar la altura del contenido. */
      .eci-collapse__region {
        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows var(--transition-base);
      }

      :host(.is-open) .eci-collapse__region {
        grid-template-rows: 1fr;
      }

      .eci-collapse__content {
        overflow: hidden;
      }

      .eci-collapse__content > :first-child {
        margin-top: var(--space-1);
      }

      @media (prefers-reduced-motion: reduce) {
        .eci-collapse__region {
          transition: none;
        }
      }
    `,
  ],
})
export class CollapseComponent {
  /** Texto del encabezado (ya traducido por el llamador). */
  readonly summary = input('');
  protected readonly open = signal(false);

  toggle(): void {
    this.open.update((v) => !v);
  }
}
