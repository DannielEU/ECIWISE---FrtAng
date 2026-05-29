import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button';

@Component({
  imports: [ButtonComponent],
  template: `
    <eci-button [disabled]="disabled()" (click)="onClick()">Go</eci-button>
  `,
})
class HostComponent {
  readonly disabled = signal(false);
  clicks = 0;
  onClick(): void {
    this.clicks++;
  }
}

describe('ButtonComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
  });

  it('propaga el click del botón interno al host', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const nativeButton = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(nativeButton).not.toBeNull();
    nativeButton.click();

    expect(fixture.componentInstance.clicks).toBe(1);
  });

  it('no dispara click cuando está deshabilitado', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    const nativeButton = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(nativeButton.disabled).toBe(true);
    nativeButton.click();

    expect(fixture.componentInstance.clicks).toBe(0);
  });
});
