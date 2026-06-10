import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { IaProfileStatusService } from '../../../core/ia/ia-profile-status.service';
import { CardComponent } from '../../../shared/ui/card/card';
import { ButtonComponent } from '../../../shared/ui/button/button';

/**
 * Aviso inicial para terminar el perfil de IA. La tarjeta permanece en Inicio,
 * pero el llenado ocurre en la seccion Perfil para mantener un solo lugar de
 * datos personales.
 */
@Component({
  selector: 'eci-complete-profile-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, CardComponent, ButtonComponent],
  templateUrl: './complete-profile-section.html',
  styleUrl: './complete-profile-section.css',
})
export class CompleteProfileSectionComponent {
  private readonly router = inject(Router);
  private readonly status = inject(IaProfileStatusService);

  protected readonly show = computed(
    () =>
      this.status.loaded() &&
      this.status.performanceComplete() &&
      !this.status.dropoutComplete(),
  );

  constructor() {
    if (!this.status.loaded()) {
      this.status.load();
    }
  }

  start(): void {
    void this.router.navigate(['/student/profile'], {
      queryParams: { completeProfile: '1' },
    });
  }
}
