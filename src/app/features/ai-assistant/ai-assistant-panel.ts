import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideSend } from '@lucide/angular';
import { AiAssistantService } from './ai-assistant.service';

/** Panel de conversación con el asistente de IA (mock). */
@Component({
  selector: 'eci-ai-assistant-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, TranslatePipe, LucideSend],
  templateUrl: './ai-assistant-panel.html',
})
export class AiAssistantPanelComponent {
  private readonly assistant = inject(AiAssistantService);
  protected readonly messages = this.assistant.messages;
  protected readonly draft = signal('');
  protected readonly sending = signal(false);

  send(): void {
    const text = this.draft().trim();
    if (!text || this.sending()) {
      return;
    }
    this.sending.set(true);
    this.draft.set('');
    this.assistant.send(text).subscribe({
      next: () => this.sending.set(false),
      error: () => this.sending.set(false),
    });
  }
}
