import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonComponent } from '../../shared/ui/button/button';
import { LogoComponent } from '../../shared/ui/logo/logo';
import { ThemeToggleComponent } from '../../core/theme/theme-toggle';
import { LanguageSwitchComponent } from '../../core/i18n/language-switch';
import { A11yToggleComponent } from '../../core/a11y/a11y-toggle';
import { LandingSceneService } from './landing-scene.service';

/**
 * Landing pública con escena espacial 3D interactiva. La escena solo se
 * inicializa en el navegador y se omite si el usuario prefiere movimiento
 * reducido.
 */
@Component({
  selector: 'eci-landing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LandingSceneService],
  imports: [
    TranslatePipe,
    ButtonComponent,
    LogoComponent,
    ThemeToggleComponent,
    LanguageSwitchComponent,
    A11yToggleComponent,
  ],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class LandingComponent {
  private readonly scene = inject(LandingSceneService);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly stage = viewChild<ElementRef<HTMLElement>>('stage');

  constructor() {
    afterNextRender(() => {
      if (!this.isBrowser || this.prefersReducedMotion()) {
        return;
      }
      const canvas = this.canvas()?.nativeElement;
      const stage = this.stage()?.nativeElement;
      if (canvas && stage) {
        void this.scene.init(canvas, stage);
      }
    });
    inject(DestroyRef).onDestroy(() => this.scene.dispose());
  }

  goToLogin(): void {
    void this.router.navigate(['/auth/login']);
  }

  goToRegister(): void {
    void this.router.navigate(['/auth/register']);
  }

  private prefersReducedMotion(): boolean {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  }
}
