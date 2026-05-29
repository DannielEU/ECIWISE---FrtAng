import { TestBed } from '@angular/core/testing';
import { A11yService } from './a11y.service';

describe('A11yService', () => {
  let service: A11yService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('a11y-mode');
    TestBed.configureTestingModule({});
    service = TestBed.inject(A11yService);
  });

  it('activa el modo accesible aplicando la clase y persistiendo', () => {
    service.setEnabled(true);
    expect(service.enabled()).toBe(true);
    expect(document.documentElement.classList.contains('a11y-mode')).toBe(true);
    expect(localStorage.getItem('eciwise.a11y')).toBe('true');
  });

  it('alterna el modo accesible', () => {
    service.setEnabled(false);
    service.toggle();
    expect(service.enabled()).toBe(true);
    service.toggle();
    expect(service.enabled()).toBe(false);
    expect(document.documentElement.classList.contains('a11y-mode')).toBe(false);
  });
});
