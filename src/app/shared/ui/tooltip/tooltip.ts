import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { IconComponent } from '../icon/icon';

/**
 * Icono de informacion con tooltip accesible. El texto debe llegar ya traducido:
 * `[text]="'clave' | translate"`.
 */
@Component({
  selector: 'eci-info-tooltip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    <span class="tip">
      <button
        type="button"
        class="tip__trigger"
        [attr.aria-label]="label()"
        (mouseenter)="show()"
        (mouseleave)="hide()"
        (focus)="show()"
        (blur)="hide()"
      >
        <eci-icon name="info" [size]="size()" />
      </button>
      <span
        class="tip__bubble"
        role="tooltip"
        [class.tip__bubble--visible]="visible()"
        [class.tip__bubble--below]="below()"
        [style.left.px]="left()"
        [style.top.px]="top()"
      >
        {{ text() }}
      </span>
    </span>
  `,
  styleUrl: './tooltip.css',
})
export class InfoTooltipComponent {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly text = input.required<string>();
  readonly ariaLabel = input<string>('');
  readonly size = input(16);

  protected readonly visible = signal(false);
  protected readonly left = signal(0);
  protected readonly top = signal(0);
  protected readonly below = signal(false);

  private readonly bubbleWidth = 288;

  protected label(): string {
    return this.ariaLabel() || this.text();
  }

  protected show(): void {
    const trigger = this.host.nativeElement.querySelector('.tip__trigger');
    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();
    const viewportWidth = globalThis.innerWidth || 1024;
    const left = Math.min(
      Math.max(rect.left + rect.width / 2, this.bubbleWidth / 2 + 8),
      viewportWidth - this.bubbleWidth / 2 - 8,
    );
    const below = rect.top <= 120;
    const top = below ? rect.bottom + 12 : rect.top - 12;

    this.left.set(left);
    this.top.set(top);
    this.below.set(below);
    this.visible.set(true);
  }

  protected hide(): void {
    this.visible.set(false);
  }
}
