import { Injectable } from '@angular/core';

export interface AppEnv {
  apiBaseUrl?: string;
  [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class EnvService {
  private env: AppEnv = {};

  async load(): Promise<void> {
    try {
      const res = await fetch('/assets/env.json', { cache: 'no-cache' });
      if (res.ok) {
        this.env = await res.json();
      }
    } catch {
      // ignore, keep defaults
    }
  }

  get(key: string, fallback?: string): string | undefined {
    const globalEnv = (globalThis as { __APP_ENV__?: Record<string, unknown> }).__APP_ENV__;
    const value = this.env[key] ?? globalEnv?.[key];
    return typeof value === 'string' ? value : fallback;
  }
}
