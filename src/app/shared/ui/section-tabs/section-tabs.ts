import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { IconComponent, IconName } from '../icon/icon';

/** Una sección navegable: id estable, etiqueta i18n e icono opcional. */
export interface SectionTab {
  readonly id: string;
  readonly labelKey: string;
  readonly icon?: IconName;
}

/**
 * Botones de sección identificables con animación: control segmentado con un
 * indicador deslizante (la "píldora" activa se desliza al cambiar de sección).
 * Es la pieza compartida para dividir cualquier pantalla en secciones que caben
 * en el viewport sin necesidad de scroll. Vincula la sección activa por su `id`
 * mediante el modelo `active` (two-way: `[(active)]`).
 */
@Component({
  selector: 'eci-section-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, IconComponent],
  template: `
    <div class="seg" role="tablist" [style.--seg-n]="tabs().length">
      <span
        class="seg__indicator"
        [style.transform]="indicatorTransform()"
        aria-hidden="true"
      ></span>
      @for (t of tabs(); track t.id) {
        <button
          type="button"
          role="tab"
          class="seg__btn"
          [class.seg__btn--active]="t.id === active()"
          [attr.aria-selected]="t.id === active()"
          (click)="select(t.id)"
        >
          @if (t.icon; as ic) {
            <eci-icon [name]="ic" [size]="18" />
          }
          <span class="seg__label">{{ t.labelKey | translate }}</span>
        </button>
      }
    </div>
  `,
  styleUrl: './section-tabs.css',
})
export class SectionTabsComponent {
  readonly tabs = input.required<readonly SectionTab[]>();
  /** Id de la sección activa (two-way). */
  readonly active = model.required<string>();

  protected readonly activeIndex = computed(() =>
    Math.max(0, this.tabs().findIndex((t) => t.id === this.active())),
  );

  /** Desliza el indicador a la posición de la sección activa. */
  protected readonly indicatorTransform = computed(
    () => `translateX(${this.activeIndex() * 100}%)`,
  );

  select(id: string): void {
    this.active.set(id);
  }
}
