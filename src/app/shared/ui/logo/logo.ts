import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Marca de ECIWISE+. Siempre enlaza al inicio de la plataforma.
 * El destino se ajusta según el rol mediante la entrada `home`.
 */
@Component({
  selector: 'eci-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslatePipe],
  template: `
    <a class="eci-logo" [routerLink]="home()" [attr.aria-label]="'app.name' | translate">
      <svg class="eci-logo__mark" viewBox="0 0 48 48" aria-hidden="true">
        <path
          class="eci-logo__astroid"
          d="M24 4 C20 16 16 20 4 24 C16 28 20 32 24 44 C28 32 32 28 44 24 C32 20 28 16 24 4 Z"
        />
        <path class="eci-logo__plus" d="M24 17 V31 M17 24 H31" />
      </svg>
      @if (showWordmark()) {
        <span class="eci-logo__word">ECIWISE<span class="eci-logo__plus-word">+</span></span>
      }
    </a>
  `,
  styleUrl: './logo.css',
})
export class LogoComponent {
  /** Ruta de inicio (cambia según el rol). */
  readonly home = input('/');
  readonly showWordmark = input(true);
}
