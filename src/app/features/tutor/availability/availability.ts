import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PageHeaderComponent } from '../../../shared/ui/page-header/page-header';
import { CardComponent } from '../../../shared/ui/card/card';
import { ButtonComponent } from '../../../shared/ui/button/button';
import { AvailabilityService, SlotKey } from '../availability.service';
import { TIME_BLOCKS, WEEK_DAYS, WeekDay } from '../tutor.models';

/** Edición de la disponibilidad semanal del tutor por bloques. */
@Component({
  selector: 'eci-tutor-availability',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, PageHeaderComponent, CardComponent, ButtonComponent],
  templateUrl: './availability.html',
  styleUrl: './availability.css',
})
export class TutorAvailabilityComponent {
  private readonly service = inject(AvailabilityService);

  protected readonly days = WEEK_DAYS;
  protected readonly blocks = TIME_BLOCKS;
  protected readonly slots = this.service.slots;
  protected readonly saved = signal(false);

  key(day: WeekDay, block: string): SlotKey {
    return `${day}-${block}`;
  }

  isActive(day: WeekDay, block: string): boolean {
    return this.service.isActive(this.key(day, block));
  }

  toggle(day: WeekDay, block: string): void {
    this.service.toggle(this.key(day, block));
    this.saved.set(false);
  }

  save(): void {
    this.service.persist();
    this.saved.set(true);
  }
}
