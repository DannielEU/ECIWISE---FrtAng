import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthError, AuthService } from '../../../core/auth/auth.service';
import { GoogleAuthService } from '../../../core/auth/google-auth.service';
import { GoogleJwtClaims } from '../../../core/models/google-credential.model';
import { ROLE_HOME } from '../../../core/models/role.enum';
import { User } from '../../../core/models/user.model';
import { ButtonComponent } from '../../../shared/ui/button/button';
import { LogoComponent } from '../../../shared/ui/logo/logo';

/** Pantalla de inicio de sesión (correo + Google). */
@Component({
  selector: 'eci-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe, ButtonComponent, LogoComponent],
  templateUrl: './login.html',
  styleUrl: '../auth.css',
})
export class LoginComponent implements AfterViewInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly google = inject(GoogleAuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly googleContainer =
    viewChild<ElementRef<HTMLElement>>('googleBtn');

  protected readonly loading = signal(false);
  protected readonly errorKey = signal<string | null>(null);
  protected readonly googleConfigured = this.google.isConfigured;

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  ngAfterViewInit(): void {
    const container = this.googleContainer()?.nativeElement;
    if (container) {
      void this.google.renderButton(container, (claims) => this.onGoogle(claims));
    }
  }

  submit(): void {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.errorKey.set(null);
    this.auth.loginWithEmail(this.form.getRawValue()).subscribe({
      next: (user) => this.redirect(user),
      error: (err: unknown) => this.fail(err),
    });
  }

  /** Inicio de sesión simulado cuando GIS no está configurado. */
  simulatedGoogle(): void {
    this.onGoogle(this.google.simulatedClaims());
  }

  private onGoogle(claims: GoogleJwtClaims): void {
    this.loading.set(true);
    this.auth.loginWithGoogle(claims).subscribe({
      next: (user) => this.redirect(user),
      error: (err: unknown) => this.fail(err),
    });
  }

  private fail(err: unknown): void {
    this.loading.set(false);
    this.errorKey.set(err instanceof AuthError ? err.messageKey : 'auth.invalid');
  }

  private redirect(user: User): void {
    const redirect = this.route.snapshot.queryParamMap.get('redirect');
    void this.router.navigateByUrl(redirect ?? ROLE_HOME[user.role]);
  }
}
