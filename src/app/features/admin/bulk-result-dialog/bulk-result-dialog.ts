import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonComponent } from '../../../shared/ui/button/button';
import { IconComponent } from '../../../shared/ui/icon/icon';
import { BulkUploadResult } from '../user-admin.service';

/** Tamaño de página de la tabla de usuarios creados. */
const PAGE_SIZE = 5;

/**
 * Diálogo (pop-up) que muestra el resultado de una carga masiva por CSV:
 * los usuarios creados con su contraseña temporal de forma paginada, y un
 * resumen de las filas con error. El padre controla su visibilidad montándolo
 * solo cuando hay un `result`.
 */
@Component({
  selector: 'eci-bulk-result-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, ButtonComponent, IconComponent],
  templateUrl: './bulk-result-dialog.html',
  styleUrl: './bulk-result-dialog.css',
  host: { '(document:keydown.escape)': 'onClose()' },
})
export class BulkResultDialogComponent {
  readonly result = input.required<BulkUploadResult>();
  readonly closed = output<void>();

  protected readonly pageSize = PAGE_SIZE;
  /** Página actual (0-based). Se reinicia a 0 cuando cambia el resultado. */
  protected readonly page = linkedSignal<BulkUploadResult, number>({
    source: this.result,
    computation: () => 0,
  });

  /** Índice global de la fila cuya contraseña se acaba de copiar. */
  protected readonly copiedIndex = signal<number | null>(null);
  /** Marca efímera cuando se copian todas las contraseñas. */
  protected readonly copiedAll = signal(false);

  protected readonly users = computed(() => this.result().usuarios);
  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.users().length / this.pageSize)),
  );
  protected readonly pagedUsers = computed(() => {
    const start = this.page() * this.pageSize;
    return this.users().slice(start, start + this.pageSize);
  });
  /** Offset global para numerar filas a través de las páginas. */
  protected readonly pageOffset = computed(() => this.page() * this.pageSize);

  /** Sufijo de clase del badge según el rol (estudiante/tutor/admin). */
  protected roleClass(rol: string): string {
    return rol.toLowerCase();
  }

  prev(): void {
    this.page.update((p) => Math.max(0, p - 1));
  }

  next(): void {
    this.page.update((p) => Math.min(this.totalPages() - 1, p + 1));
  }

  onClose(): void {
    this.closed.emit();
  }

  async copyPassword(password: string, index: number): Promise<void> {
    if (await this.writeClipboard(password)) {
      this.copiedIndex.set(index);
      setTimeout(() => this.copiedIndex.set(null), 1500);
    }
  }

  /** Copia todas las parejas correo/contraseña como texto (una por línea). */
  async copyAll(): Promise<void> {
    const text = this.users()
      .map((u) => `${u.email},${u.passwordTemporal}`)
      .join('\n');
    if (await this.writeClipboard(text)) {
      this.copiedAll.set(true);
      setTimeout(() => this.copiedAll.set(false), 1500);
    }
  }

  private async writeClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // El portapapeles puede no estar disponible (p. ej. contexto no seguro).
      return false;
    }
  }
}
