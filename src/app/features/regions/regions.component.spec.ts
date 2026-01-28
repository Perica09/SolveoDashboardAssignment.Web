import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RegionsComponent } from './regions.component';
import { MetricsService } from '../../core/services';
import { of } from 'rxjs';

describe('RegionsComponent', () => {
  let component: RegionsComponent;
  let fixture: ComponentFixture<RegionsComponent>;
  let metricsService: jasmine.SpyObj<MetricsService>;

  beforeEach(async () => {
    const metricsServiceSpy = jasmine.createSpyObj('MetricsService', ['getAllRegionalPerformance']);

    await TestBed.configureTestingModule({
      imports: [
        RegionsComponent,
        HttpClientTestingModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MetricsService, useValue: metricsServiceSpy }
      ]
    }).compileComponents();

    metricsService = TestBed.inject(MetricsService) as jasmine.SpyObj<MetricsService>;
    metricsService.getAllRegionalPerformance.and.returnValue(of([]));

    fixture = TestBed.createComponent(RegionsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load regional data on init', () => {
    fixture.detectChanges();
    expect(metricsService.getAllRegionalPerformance).toHaveBeenCalled();
  });

  it('should have correct displayed columns', () => {
    expect(component.displayedColumns).toEqual([
      'region',
      'country',
      'city',
      'month',
      'organicTraffic',
      'paidTraffic',
      'totalTraffic',
      'trialsStarted',
      'paidConversions',
      'trialToPaidRate',
      'mrrUsd',
      'cacUsd',
      'ltvUsd'
    ]);
  });

  it('should format numbers correctly', () => {
    expect(component.formatNumber(1234)).toBe('1,234');
    expect(component.formatNumber(null)).toBe('-');
    expect(component.formatNumber(undefined)).toBe('-');
  });

  it('should format currency correctly', () => {
    expect(component.formatCurrency(1234.56)).toBe('$1,234.56');
    expect(component.formatCurrency(null)).toBe('-');
    expect(component.formatCurrency(undefined)).toBe('-');
  });

  it('should format percentage correctly', () => {
    expect(component.formatPercentage(12.345)).toBe('12.35%');
    expect(component.formatPercentage(null)).toBe('-');
    expect(component.formatPercentage(undefined)).toBe('-');
  });

  it('should reset filters', () => {
    component.searchControl.setValue('test');
    component.regionControl.setValue('Europe');
    component.resetFilters();
    expect(component.searchControl.value).toBe('');
    expect(component.regionControl.value).toBe('all');
  });
});
