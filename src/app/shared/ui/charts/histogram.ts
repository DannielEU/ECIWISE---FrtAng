import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Barra del histograma. */
export interface HistogramBar {
  label: string;
  value: number;
}

interface RenderedBar extends HistogramBar {
  heightPct: number;
}

/**
 * Histograma de barras verticales en CSS, sin dependencias. Escala las barras
 * al valor máximo de la serie y muestra etiqueta y valor de cada columna.
 */
@Component({
  selector: 'eci-histogram',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (max() === 0) {
      <p class="hist__empty"><ng-content /></p>
    } @else {
      <div class="hist" [style.--hist-color]="color()">
        @for (b of bars(); track b.label) {
          <div class="hist__col">
            <span class="hist__value">{{ b.value }}</span>
            <span class="hist__bar" [style.height.%]="b.heightPct"></span>
            <span class="hist__label">{{ b.label }}</span>
          </div>
        }
      </div>
    }
  `,
  styleUrl: './histogram.css',
})
export class HistogramComponent {
  readonly data = input.required<HistogramBar[]>();
  readonly color = input<string>('var(--accent)');

  protected readonly max = computed(() =>
    this.data().reduce((m, b) => Math.max(m, b.value), 0),
  );

  protected readonly bars = computed<RenderedBar[]>(() => {
    const max = this.max();
    return this.data().map((b) => ({
      ...b,
      heightPct: max === 0 ? 0 : Math.max(2, (b.value / max) * 100),
    }));
  });
}
