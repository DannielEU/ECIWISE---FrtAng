import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideLanguages } from '@lucide/angular';
import { I18nService } from './i18n.service';

/** Botón para alternar el idioma de la interfaz (ES / EN). */
@Component({
  selector: 'eci-language-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, UpperCasePipe, LucideLanguages],
  template: `
    <button
      type="button"
      class="icon-button"
      (click)="i18n.toggle()"
      [attr.aria-label]="'language.toggle' | translate"
    >
      <svg lucideLanguages [size]="20" aria-hidden="true"></svg>
      <span class="lang-code">{{ i18n.lang() | uppercase }}</span>
    </button>
  `,
  styles: [
    `
      .icon-button {
        width: auto;
        gap: var(--space-1);
        padding: 0 var(--space-2);
      }
      .lang-code {
        font-size: 0.75rem;
        font-weight: 700;
      }
    `,
  ],
})
export class LanguageSwitchComponent {
  protected readonly i18n = inject(I18nService);
}
