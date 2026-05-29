import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { TopBarComponent } from '../top-bar/top-bar';
import { SideNavComponent } from '../side-nav/side-nav';
import { FloatingActionsComponent } from '../floating-actions/floating-actions';

/**
 * Estructura principal de las áreas autenticadas: barra superior, navegación
 * lateral, contenido enrutado y acciones flotantes (IA + chats).
 */
@Component({
  selector: 'eci-app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    TranslatePipe,
    TopBarComponent,
    SideNavComponent,
    FloatingActionsComponent,
  ],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.css',
})
export class AppShellComponent {
  protected readonly navOpen = signal(false);

  toggleNav(): void {
    this.navOpen.update((v) => !v);
  }

  closeNav(): void {
    this.navOpen.set(false);
  }
}
