export type AiAuthor = 'user' | 'assistant';

/** Mensaje dentro de la conversación con el asistente de IA. */
export interface AiMessage {
  readonly id: string;
  readonly author: AiAuthor;
  readonly text: string;
}
