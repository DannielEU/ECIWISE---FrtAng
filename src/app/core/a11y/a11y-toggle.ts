import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideAccessibility } from '@lucide/angular';
import { A11yService } from './a11y.service';

/** Botón para activar el modo de accesibilidad reforzada (atajo: Alt+A). */
@Component({
  selector: 'eci-a11y-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, LucideAccessibility],
  template: `
    <button
      type="button"
      class="icon-button"
      (click)="a11y.toggle()"
      [class.icon-button--active]="a11y.enabled()"
      [attr.aria-label]="'a11y.toggle' | translate"
      [attr.aria-pressed]="a11y.enabled()"
      title="Alt + A"
    >
      <svg lucideAccessibility [size]="20" aria-hidden="true"></svg>
    </button>
  `,
  styles: [
    `
      .icon-button--active {
        background: color-mix(in srgb, var(--accent) 18%, transparent);
        color: var(--accent);
      }
    `,
  ],
})
export class A11yToggleComponent {
  protected readonly a11y = inject(A11yService);
}
