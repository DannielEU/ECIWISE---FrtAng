import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PageHeaderComponent } from '../../../shared/ui/page-header/page-header';
import { CardComponent } from '../../../shared/ui/card/card';
import { EstudianteIa, IaAdminService } from '../../../core/ia/ia-admin.service';

/**
 * Tabla de estudiantes con su predicción. La usan admin (ve a todos) y tutor (ve
 * a sus asignados): el alcance lo resuelve el backend según el rol del token.
 */
@Component({
  selector: 'eci-students-predictions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, PageHeaderComponent, CardComponent],
  templateUrl: './students-predictions.html',
  styleUrl: './students-predictions.css',
})
export class StudentsPredictionsComponent implements OnInit {
  private readonly service = inject(IaAdminService);

  protected readonly students = signal<EstudianteIa[]>([]);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    this.service.listStudents().subscribe({
      next: (list) => {
        this.students.set(list);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
