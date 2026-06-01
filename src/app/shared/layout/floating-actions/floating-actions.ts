import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideBot, LucideMessageCircle, LucidePlus, LucideX } from '@lucide/angular';
import { AiAssistantPanelComponent } from '../../../features/ai-assistant/ai-assistant-panel';
import { ChatPanelComponent } from '../../../features/chat/chat-panel';

type DockPanel = 'assistant' | 'chat' | null;

/**
 * Acciones flotantes en la esquina inferior derecha. Por defecto solo se ve un
 * botón rojo de menú (en la posición del antiguo botón de IA); al pulsarlo se
 * despliegan, con una animación suave, los botones de IA y chats. Si el usuario
 * navega a otra parte sin usarlos, se repliegan solos. Abrir cualquiera de los
 * dos muestra el panel acoplado, como antes.
 */
@Component({
  selector: 'eci-floating-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslatePipe,
    LucideBot,
    LucideMessageCircle,
    LucidePlus,
    LucideX,
    AiAssistantPanelComponent,
    ChatPanelComponent,
  ],
  templateUrl: './floating-actions.html',
  styleUrl: './floating-actions.css',
})
export class FloatingActionsComponent {
  private readonly router = inject(Router);
  protected readonly active = signal<DockPanel>(null);
  /** Indica si el menú de acciones está desplegado (IA + chats visibles). */
  protected readonly expanded = signal(false);

  constructor() {
    // Al cambiar de sección sin usar las acciones, se repliegan solas.
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(inject(DestroyRef)),
      )
      .subscribe(() => this.expanded.set(false));
  }

  /** Despliega o repliega los botones de IA y chats. */
  toggle(): void {
    this.expanded.update((v) => !v);
  }

  open(panel: Exclude<DockPanel, null>): void {
    this.active.update((current) => (current === panel ? null : panel));
  }

  close(): void {
    this.active.set(null);
    // Al cerrar el panel se vuelve al botón de menú original.
    this.expanded.set(false);
  }
}
