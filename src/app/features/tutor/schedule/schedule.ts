import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { PageHeaderComponent } from '../../../shared/ui/page-header/page-header';
import { CardComponent } from '../../../shared/ui/card/card';
import { ButtonComponent } from '../../../shared/ui/button/button';
import { TutorScheduleService } from '../schedule.service';
import { TutorSession } from '../tutor.models';

/** Creación y gestión de los horarios de tutoría del tutor. */
@Component({
  selector: 'eci-tutor-schedule',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    TranslatePipe,
    PageHeaderComponent,
    CardComponent,
    ButtonComponent,
  ],
  templateUrl: './schedule.html',
  styleUrl: './schedule.css',
})
export class TutorScheduleComponent {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(TutorScheduleService);
  protected readonly sessions = this.service.sessions;

  protected readonly form = this.fb.nonNullable.group({
    subject: ['', [Validators.required]],
    datetime: ['', [Validators.required]],
    seats: [4, [Validators.required, Validators.min(1)]],
  });

  create(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { subject, datetime, seats } = this.form.getRawValue();
    this.service.create(subject, datetime, seats);
    this.form.reset({ subject: '', datetime: '', seats: 4 });
  }

  cancel(session: TutorSession): void {
    this.service.cancel(session.id);
  }
}
