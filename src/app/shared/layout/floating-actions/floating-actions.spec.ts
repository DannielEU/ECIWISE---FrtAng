import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { FloatingActionsComponent } from './floating-actions';
import { StaticTranslateLoader } from '../../../core/i18n/static-translate.loader';

describe('FloatingActionsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingActionsComponent],
      providers: [
        provideTranslateService({
          loader: { provide: TranslateLoader, useClass: StaticTranslateLoader },
          fallbackLang: 'es',
          lang: 'es',
        }),
      ],
    }).compileComponents();
  });

  it('muestra los dos botones flotantes y ningún panel al inicio', () => {
    const fixture = TestBed.createComponent(FloatingActionsComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelectorAll('.fab').length).toBe(2);
    expect(el.querySelector('.dock')).toBeNull();
  });

  it('al abrir un panel oculta los botones y muestra el drawer lateral', () => {
    const fixture = TestBed.createComponent(FloatingActionsComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    const assistantFab = el.querySelectorAll('.fab')[1] as HTMLButtonElement;
    assistantFab.click();
    fixture.detectChanges();

    expect(el.querySelector('.fab-group')).toBeNull();
    expect(el.querySelector('.dock')).not.toBeNull();
    expect(el.querySelector('eci-ai-assistant-panel')).not.toBeNull();

    const closeBtn = el.querySelector('.dock__header button') as HTMLButtonElement;
    closeBtn.click();
    fixture.detectChanges();

    expect(el.querySelectorAll('.fab').length).toBe(2);
    expect(el.querySelector('.dock')).toBeNull();
  });
});
