/** Mensaje de chat entre usuarios de la plataforma. */
export interface ChatMessage {
  readonly id: string;
  readonly fromMe: boolean;
  readonly author: string;
  readonly text: string;
}
