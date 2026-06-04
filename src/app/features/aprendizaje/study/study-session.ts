import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CardComponent } from '../../../shared/ui/card/card';
import { ButtonComponent } from '../../../shared/ui/button/button';
import { IconComponent } from '../../../shared/ui/icon/icon';
import { InfoTooltipComponent } from '../../../shared/ui/tooltip/tooltip';
import { ConfettiComponent } from '../../../shared/ui/confetti/confetti';
import { AprendizajeService } from '../aprendizaje.service';
import { Collection, ReviewGrade, StudyCard } from '../study.models';

/** Distancia (px) que hay que arrastrar para calificar al soltar. */
const DRAG_THRESHOLD = 90;

/** Distancia (px) a la que la tarjeta alcanza su tamaño mínimo al arrastrar. */
const SCALE_DISTANCE = 220;
/** Escala mínima de la tarjeta cuando se acerca al borde (paralax inverso). */
const MIN_SCALE = 0.4;
/**
 * Tope (px) del desplazamiento visual de la tarjeta. El movimiento se amortigua
 * con `tanh`, de modo que por mucho que se arrastre el centro nunca se aleja más
 * de este margen: la tarjeta se encoge y se queda dentro de los bordes.
 */
const MAX_OFFSET = 120;

/** Intención de calificación según la dirección del arrastre. */
type DragIntent = ReviewGrade | null;

/** Sesión de estudio con repetición espaciada (tarjeta volteable + gestos). */
@Component({
  selector: 'eci-aprendizaje-study',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslatePipe,
    CardComponent,
    ButtonComponent,
    IconComponent,
    InfoTooltipComponent,
    ConfettiComponent,
  ],
  templateUrl: './study-session.html',
  styleUrl: './study-session.css',
})
export class StudySessionComponent {
  private readonly service = inject(AprendizajeService);

  protected readonly collections = signal<Collection[]>([]);
  protected readonly selectedId = signal<number | null>(null);
  protected readonly queue = signal<StudyCard[]>([]);
  protected readonly index = signal(0);
  protected readonly revealed = signal(false);
  protected readonly loading = signal(false);
  protected readonly grading = signal(false);

  // ── Estado del arrastre (gestos) ──
  protected readonly dragX = signal(0);
  protected readonly dragY = signal(0);
  protected readonly dragging = signal(false);
  private pointerId: number | null = null;
  private startX = 0;
  private startY = 0;

  protected readonly current = computed(() => this.queue()[this.index()] ?? null);
  protected readonly remaining = computed(() => this.queue().length - this.index());
  /** Se completó la cola (había tarjetas y ya se repasaron todas). */
  protected readonly finished = computed(
    () => this.queue().length > 0 && this.index() >= this.queue().length,
  );

  /** Calificación a la que apunta el arrastre actual (para feedback visual). */
  protected readonly intent = computed<DragIntent>(() => {
    if (!this.dragging()) {
      return null;
    }
    return this.resolveIntent(this.dragX(), this.dragY());
  });

  /**
   * Transformación de la tarjeta durante el arrastre: además de seguir al
   * puntero y girar levemente, se encoge cuanto más se aleja del centro
   * (paralax inverso), reforzando que se va "soltando" hacia un estado.
   */
  protected readonly cardTransform = computed<string | null>(() => {
    const dx = this.dragX();
    const dy = this.dragY();
    if (!this.dragging() && dx === 0 && dy === 0) {
      return null;
    }
    const distance = Math.hypot(dx, dy);
    const scale = Math.max(MIN_SCALE, 1 - (distance / SCALE_DISTANCE) * (1 - MIN_SCALE));
    // Desplazamiento amortiguado: tiende a MAX_OFFSET pero nunca lo supera.
    const tx = MAX_OFFSET * Math.tanh(dx / MAX_OFFSET);
    const ty = MAX_OFFSET * Math.tanh(dy / MAX_OFFSET);
    return `translate(${tx}px, ${ty}px) rotate(${tx / 9}deg) scale(${scale})`;
  });

  constructor() {
    this.service.collections().subscribe((cols) => this.collections.set(cols));
  }

  protected pick(value: string): void {
    const id = Number(value);
    if (!id) {
      this.selectedId.set(null);
      return;
    }
    this.selectedId.set(id);
    this.loadQueue(id);
  }

  protected reveal(): void {
    this.revealed.set(true);
  }

  protected grade(grade: ReviewGrade): void {
    const card = this.current();
    if (!card || this.grading()) {
      return;
    }
    this.grading.set(true);
    this.service.review(card.card.id, grade).subscribe({
      next: () => this.advance(),
      error: () => {
        this.grading.set(false);
        this.resetDrag();
      },
    });
  }

  protected restart(): void {
    this.selectedId.set(null);
    this.queue.set([]);
    this.index.set(0);
    this.revealed.set(false);
    this.resetDrag();
  }

  // ── Pointer events (arrastre para calificar) ──

  protected onPointerDown(event: PointerEvent): void {
    if (!this.revealed() || this.grading()) {
      return;
    }
    this.pointerId = event.pointerId;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.dragging.set(true);
    (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
  }

  protected onPointerMove(event: PointerEvent): void {
    if (!this.dragging() || event.pointerId !== this.pointerId) {
      return;
    }
    this.dragX.set(event.clientX - this.startX);
    this.dragY.set(Math.max(0, event.clientY - this.startY));
  }

  protected onPointerUp(event: PointerEvent): void {
    if (!this.dragging() || event.pointerId !== this.pointerId) {
      return;
    }
    const decided = this.resolveIntent(this.dragX(), this.dragY());
    if (decided) {
      this.grade(decided);
    } else {
      this.resetDrag();
    }
    this.dragging.set(false);
    this.pointerId = null;
  }

  /** Mapea un desplazamiento a una calificación si supera el umbral. */
  private resolveIntent(x: number, y: number): DragIntent {
    if (Math.abs(x) >= Math.abs(y)) {
      if (x <= -DRAG_THRESHOLD) return 'REPETIR';
      if (x >= DRAG_THRESHOLD) return 'APRENDIDO';
    } else if (y >= DRAG_THRESHOLD) {
      return 'ACEPTABLE';
    }
    return null;
  }

  private resetDrag(): void {
    this.dragX.set(0);
    this.dragY.set(0);
    this.dragging.set(false);
    this.pointerId = null;
  }

  private loadQueue(id: number): void {
    this.loading.set(true);
    this.index.set(0);
    this.revealed.set(false);
    this.resetDrag();
    this.service.studyQueue(id).subscribe({
      next: (q) => {
        this.queue.set(q);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private advance(): void {
    this.revealed.set(false);
    this.resetDrag();
    this.index.update((i) => i + 1);
    this.grading.set(false);
  }
}
