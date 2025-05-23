import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AboutObjectivesComponent} from './about-objectives.component';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {provideIonicAngular} from '@ionic/angular/standalone';
import {AppTranslocoTestingModule} from '../../../../core/modules/transloco/transloco-testing.module';

describe('AboutObjectivesComponent', () => {
  let component: AboutObjectivesComponent;
  let fixture: ComponentFixture<AboutObjectivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTranslocoTestingModule, AboutObjectivesComponent],
      providers: [provideIonicAngular()],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutObjectivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass accessibility test', async () => {
    jasmine.addMatchers(toHaveNoViolations);
    const a11y = await axe(fixture.nativeElement, {
      // This component is not contained within a `mat-sidenav-content`, and thus has the wrong colors in dark mode
      rules: {
        'color-contrast': {
          enabled: false,
        },
      },
    });
    expect(a11y).toHaveNoViolations();
  });
});
