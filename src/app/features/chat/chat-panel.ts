import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideSend } from '@lucide/angular';
import { ChatService } from './chat.service';

/** Panel de mensajería entre usuarios (mock). */
@Component({
  selector: 'eci-chat-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, TranslatePipe, LucideSend],
  template: `
    <div class="conv">
      <ul class="conv__list">
        @for (msg of messages(); track msg.id) {
          <li class="conv__msg" [class.conv__msg--user]="msg.fromMe">
            <span class="conv__bubble">{{ msg.text }}</span>
          </li>
        }
      </ul>
      <form class="conv__form" (ngSubmit)="send()">
        <input
          class="conv__input"
          type="text"
          [ngModel]="draft()"
          (ngModelChange)="draft.set($event)"
          name="draft"
          [placeholder]="'floating.chat' | translate"
          [attr.aria-label]="'floating.chat' | translate"
          autocomplete="off"
        />
        <button
          type="submit"
          class="icon-button conv__send"
          [disabled]="!draft().trim()"
          [attr.aria-label]="'common.confirm' | translate"
        >
          <svg lucideSend [size]="18" aria-hidden="true"></svg>
        </button>
      </form>
    </div>
  `,
})
export class ChatPanelComponent {
  private readonly chat = inject(ChatService);
  protected readonly messages = this.chat.messages;
  protected readonly draft = signal('');

  send(): void {
    const text = this.draft().trim();
    if (!text) {
      return;
    }
    this.chat.send(text);
    this.draft.set('');
  }
}
