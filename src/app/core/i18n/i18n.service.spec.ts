import { TestBed } from '@angular/core/testing';
import { TranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { I18nService } from './i18n.service';
import { StaticTranslateLoader } from './static-translate.loader';

describe('I18nService', () => {
  let service: I18nService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService({
          loader: { provide: TranslateLoader, useClass: StaticTranslateLoader },
          fallbackLang: 'es',
          lang: 'es',
        }),
      ],
    });
    service = TestBed.inject(I18nService);
  });

  it('cambia el idioma y lo persiste', () => {
    service.use('en');
    expect(service.lang()).toBe('en');
    expect(localStorage.getItem('eciwise.lang')).toBe('en');
    expect(document.documentElement.lang).toBe('en');
  });

  it('alterna entre español e inglés', () => {
    service.use('es');
    service.toggle();
    expect(service.lang()).toBe('en');
    service.toggle();
    expect(service.lang()).toBe('es');
  });
});
