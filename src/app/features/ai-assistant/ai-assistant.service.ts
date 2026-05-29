import { Injectable, signal } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';
import { AiMessage } from './ai-message.model';

/**
 * Servicio mock del asistente de IA. Mantiene el historial en una signal y
 * genera respuestas simuladas. Reemplazable por una API de LLM real
 * (idealmente vía backend proxy) sin afectar a la UI.
 */
@Injectable({ providedIn: 'root' })
export class AiAssistantService {
  private readonly _messages = signal<AiMessage[]>([
    {
      id: 'seed',
      author: 'assistant',
      text: 'Hola, soy tu asistente de ECIWISE+. ¿En qué puedo ayudarte hoy?',
    },
  ]);
  readonly messages = this._messages.asReadonly();

  send(text: string): Observable<AiMessage> {
    const trimmed = text.trim();
    if (!trimmed) {
      return of();
    }
    this.append({ id: `u-${Date.now()}`, author: 'user', text: trimmed });
    return this.mockReply(trimmed).pipe(
      map((reply) => {
        this.append(reply);
        return reply;
      }),
    );
  }

  private mockReply(prompt: string): Observable<AiMessage> {
    const reply: AiMessage = {
      id: `a-${Date.now()}`,
      author: 'assistant',
      text: `Entiendo tu consulta sobre "${prompt}". (Respuesta simulada — se conectará a un modelo real más adelante.)`,
    };
    return of(reply).pipe(delay(500));
  }

  private append(message: AiMessage): void {
    this._messages.update((list) => [...list, message]);
  }
}
