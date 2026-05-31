import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PageHeaderComponent } from '../../../shared/ui/page-header/page-header';
import { CardComponent } from '../../../shared/ui/card/card';
import { IaAdminService, PlatformStats } from '../../../core/ia/ia-admin.service';

/** Estadísticas de IA de la plataforma (solo admin). */
@Component({
  selector: 'eci-admin-statistics',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, PageHeaderComponent, CardComponent],
  templateUrl: './statistics.html',
  styleUrl: './statistics.css',
})
export class AdminStatisticsComponent implements OnInit {
  private readonly service = inject(IaAdminService);

  protected readonly stats = signal<PlatformStats | null>(null);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    this.service.platformStats().subscribe({
      next: (s) => {
        this.stats.set(s);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  /** Máximo de la distribución para escalar las barras. */
  protected maxGrade(s: PlatformStats): number {
    return Math.max(1, ...s.distribucionRendimiento.map((g) => g.conteo));
  }
}
