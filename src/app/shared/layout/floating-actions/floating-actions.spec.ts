import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { FloatingActionsComponent } from './floating-actions';
import { StaticTranslateLoader } from '../../../core/i18n/static-translate.loader';

describe('FloatingActionsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingActionsComponent],
      providers: [
        provideRouter([]),
        provideTranslateService({
          loader: { provide: TranslateLoader, useClass: StaticTranslateLoader },
          fallbackLang: 'es',
          lang: 'es',
        }),
      ],
    }).compileComponents();
  });

  it('muestra solo el botón de menú y ningún panel al inicio', () => {
    const fixture = TestBed.createComponent(FloatingActionsComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('.fab--toggle')).not.toBeNull();
    expect(el.querySelector('.dock')).toBeNull();
    // El menú arranca replegado.
    expect(el.querySelector('.fab-group--expanded')).toBeNull();
  });

  it('despliega los botones al pulsar el menú', () => {
    const fixture = TestBed.createComponent(FloatingActionsComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    (el.querySelector('.fab--toggle') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(el.querySelector('.fab-group--expanded')).not.toBeNull();
    expect(el.querySelector('.fab--assistant')).not.toBeNull();
    expect(el.querySelector('.fab--chat')).not.toBeNull();
  });

  it('al abrir un panel oculta los botones y muestra el drawer lateral', () => {
    const fixture = TestBed.createComponent(FloatingActionsComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    (el.querySelector('.fab--toggle') as HTMLButtonElement).click();
    fixture.detectChanges();
    (el.querySelector('.fab--assistant') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(el.querySelector('.fab-group')).toBeNull();
    expect(el.querySelector('.dock')).not.toBeNull();
    expect(el.querySelector('eci-ai-assistant-panel')).not.toBeNull();

    const closeBtn = el.querySelector('.dock__header button') as HTMLButtonElement;
    closeBtn.click();
    fixture.detectChanges();

    // Al cerrar vuelve el botón de menú replegado.
    expect(el.querySelector('.fab--toggle')).not.toBeNull();
    expect(el.querySelector('.fab-group--expanded')).toBeNull();
    expect(el.querySelector('.dock')).toBeNull();
  });
});
