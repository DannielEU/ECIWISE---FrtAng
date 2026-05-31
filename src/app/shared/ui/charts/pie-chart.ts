import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Porción de datos para el gráfico de torta. */
export interface PieSlice {
  label: string;
  value: number;
  /** Color CSS opcional; si falta se toma de la paleta por defecto. */
  color?: string;
}

interface RenderedSlice extends PieSlice {
  color: string;
  percent: number;
  path: string;
}

/** Paleta institucional para series sin color explícito. */
const PALETTE = [
  'var(--accent)',
  'var(--info)',
  'var(--success)',
  'var(--warning)',
  'var(--accent-admin)',
  'var(--accent-tutor)',
];

const RADIUS = 16;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Gráfico de torta (donut) en SVG, sin dependencias externas. Renderiza cada
 * porción como un arco y una leyenda con valor y porcentaje.
 */
@Component({
  selector: 'eci-pie-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (total() === 0) {
      <p class="pie__empty"><ng-content /></p>
    } @else {
      <div class="pie">
        <svg class="pie__svg" viewBox="0 0 40 40" role="img" [attr.aria-label]="title()">
          @for (s of slices(); track s.label) {
            <circle
              class="pie__arc"
              cx="20"
              cy="20"
              [attr.r]="radius"
              [attr.stroke]="s.color"
              [attr.stroke-dasharray]="s.dash"
              [attr.stroke-dashoffset]="s.offset"
            />
          }
        </svg>
        <ul class="pie__legend">
          @for (s of slices(); track s.label) {
            <li class="pie__legend-item">
              <span class="pie__swatch" [style.background]="s.color"></span>
              <span class="pie__legend-label">{{ s.label }}</span>
              <span class="pie__legend-value">{{ s.value }} ({{ s.percent }}%)</span>
            </li>
          }
        </ul>
      </div>
    }
  `,
  styleUrl: './pie-chart.css',
})
export class PieChartComponent {
  readonly data = input.required<PieSlice[]>();
  readonly title = input<string>('');

  protected readonly radius = RADIUS;

  protected readonly total = computed(() =>
    this.data().reduce((acc, s) => acc + s.value, 0),
  );

  /** Porciones con arco, color y porcentaje precalculados. */
  protected readonly slices = computed(() => {
    const total = this.total();
    if (total === 0) return [] as (RenderedSlice & { dash: string; offset: number })[];

    let acc = 0;
    return this.data().map((s, i) => {
      const fraction = s.value / total;
      const length = fraction * CIRCUMFERENCE;
      const slice = {
        ...s,
        color: s.color ?? PALETTE[i % PALETTE.length],
        percent: Math.round(fraction * 1000) / 10,
        path: '',
        dash: `${length} ${CIRCUMFERENCE - length}`,
        // Cada arco arranca donde terminó el anterior (la rotación -90° del
        // SVG lleva el origen a las 12 en punto).
        offset: -acc,
      };
      acc += length;
      return slice;
    });
  });
}
