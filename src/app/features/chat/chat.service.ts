import { Injectable, signal } from '@angular/core';
import { ChatMessage } from './chat-message.model';

/**
 * Servicio mock de mensajería entre usuarios. Mantiene la conversación en
 * memoria. Reemplazable por WebSocket/API real sin afectar a la UI.
 */
@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly _messages = signal<ChatMessage[]>([
    { id: 'c1', fromMe: false, author: 'Carlos Tutor', text: 'Hola, ¿tienes dudas con el taller?' },
  ]);
  readonly messages = this._messages.asReadonly();

  send(text: string): void {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    this._messages.update((list) => [
      ...list,
      { id: `m-${Date.now()}`, fromMe: true, author: 'Tú', text: trimmed },
    ]);
  }
}
