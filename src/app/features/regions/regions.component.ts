import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectionStrategy, inject, DestroyRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { MetricsService } from '../../core/services';
import { RegionalMetrics } from '../../core/models';

/**
 * Filter state for regional metrics table
 */
interface FilterState {
  search: string;
  region: string;
  country: string;
  city: string;
}

/**
 * Regions component displaying regional performance metrics
 * Supports time-based aggregation and multi-level filtering
 */
@Component({
  selector: 'app-regions',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './regions.component.html',
  styleUrls: ['./regions.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class RegionsComponent implements OnInit, AfterViewInit {
  private baseColumns: string[] = [
    'region',
    'country',
    'city',
    'organicTraffic',
    'paidTraffic',
    'totalTraffic',
    'trialsStarted',
    'paidConversions',
    'trialToPaidRate',
    'mrrUsd',
    'cacUsd',
    'ltvUsd'
  ];

  get displayedColumns(): string[] {
    if (this.isAggregatedView) {
      return this.baseColumns;
    }

    return [
      'region',
      'country',
      'city',
      'month',
      ...this.baseColumns.slice(3)
    ];
  }

  dataSource = new MatTableDataSource<RegionalMetrics>([]);
  loading = false;
  error: string | null = null;
  private rawData: RegionalMetrics[] = [];
  
  regions: string[] = [];
  countries: string[] = [];
  cities: string[] = [];

  searchControl = new FormControl('');
  regionControl = new FormControl('all');
  countryControl = new FormControl('all');
  cityControl = new FormControl('all');
  timePeriodControl = new FormControl<string | number>('all');
  
  private filterState: FilterState = {
    search: '',
    region: 'all',
    country: 'all',
    city: 'all'
  };

  showGoToTop: boolean = false;
  private readonly SCROLL_THRESHOLD = 300;

  private destroyRef = inject(DestroyRef);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private metricsService: MetricsService
  ) {}

  ngOnInit(): void {
    this.loadRegionalData();
    this.setupFilterListeners();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = 10;
    this.dataSource.filterPredicate = this.createFilterPredicate();
  }

  loadRegionalData(): void {
    this.loading = true;
    this.error = null;

    this.metricsService.getAllRegionalPerformance()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.rawData = data;
          this.applyTimePeriodFilter();
          this.extractFilterOptions(data);
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message || 'Failed to load regional metrics';
          this.loading = false;
        }
      });
  }

  /**
   * Apply time period filter and aggregate data if needed
   */
  private applyTimePeriodFilter(): void {
    const timePeriod = this.timePeriodControl.value;
    
    if (timePeriod === 'all') {
      this.dataSource.data = this.rawData;
      return;
    }
    
    const months = typeof timePeriod === 'number' ? timePeriod : 12;
    const cutoffDate = this.getMonthsAgo(months);
    
    const filtered = this.rawData.filter(record => {
      if (!record.month) return true;
      const recordDate = new Date(record.month);
      return recordDate >= cutoffDate;
    });
    
    const aggregated = this.aggregateByLocation(filtered);
    this.dataSource.data = aggregated;
  }

  private getMonthsAgo(months: number): Date {
    const date = new Date();
    date.setMonth(date.getMonth() - months);
    return date;
  }

  /**
   * Aggregate regional metrics by location (region-country-city)
   */
  private aggregateByLocation(records: RegionalMetrics[]): RegionalMetrics[] {
    const grouped = new Map<string, RegionalMetrics[]>();
    
    records.forEach(record => {
      const key = `${record.region || ''}-${record.country || ''}-${record.city || ''}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(record);
    });
    
    return Array.from(grouped.values()).map(group => {
      const first = group[0];
      const count = group.length;
      
      return {
        region: first.region,
        country: first.country,
        city: first.city,
        month: count > 1 ? `${count} months avg` : first.month,
        organicTraffic: this.average(group, 'organicTraffic'),
        paidTraffic: this.average(group, 'paidTraffic'),
        totalTraffic: this.average(group, 'totalTraffic'),
        trialsStarted: this.average(group, 'trialsStarted'),
        paidConversions: this.average(group, 'paidConversions'),
        trialToPaidRate: this.average(group, 'trialToPaidRate'),
        mrrUsd: this.average(group, 'mrrUsd'),
        cacUsd: this.average(group, 'cacUsd'),
        ltvUsd: this.average(group, 'ltvUsd')
      };
    });
  }

  /**
   * Calculate average value for a specific field across multiple records
   */
  private average(records: RegionalMetrics[], field: string): number | undefined {
    const values = records
      .map(r => r[field])
      .filter(v => v !== null && v !== undefined && typeof v === 'number') as number[];
    
    if (values.length === 0) return undefined;
    
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  }

  private setupFilterListeners(): void {
    // Search with debounce
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(value => {
        this.filterState.search = value || '';
        this.applyFilters();
      });

    // Region filter
    this.regionControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.filterState.region = value || 'all';
        this.applyFilters();
      });

    // Country filter
    this.countryControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.filterState.country = value || 'all';
        this.applyFilters();
      });

    // City filter
    this.cityControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.filterState.city = value || 'all';
        this.applyFilters();
      });

    // Time period filter
    this.timePeriodControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.applyTimePeriodFilter();
      });
  }

  private createFilterPredicate() {
    return (data: RegionalMetrics, filter: string): boolean => {
      const filterObj: FilterState = JSON.parse(filter);
      const searchTerm = filterObj.search.toLowerCase();

      // Search match across region, country, city
      const searchMatch = !searchTerm ||
        data.region?.toLowerCase().includes(searchTerm) ||
        data.country?.toLowerCase().includes(searchTerm) ||
        data.city?.toLowerCase().includes(searchTerm);

      // Dropdown filters
      const regionMatch = filterObj.region === 'all' || data.region === filterObj.region;
      const countryMatch = filterObj.country === 'all' || data.country === filterObj.country;
      const cityMatch = filterObj.city === 'all' || data.city === filterObj.city;

      return !!searchMatch && !!regionMatch && !!countryMatch && !!cityMatch;
    };
  }

  private applyFilters(): void {
    this.dataSource.filter = JSON.stringify(this.filterState);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private extractFilterOptions(data: RegionalMetrics[]): void {
    this.regions = Array.from(new Set(data.map(d => d.region || ''))).filter(Boolean).sort();
    this.countries = Array.from(new Set(data.map(d => d.country || ''))).filter(Boolean).sort();
    this.cities = Array.from(new Set(data.map(d => d.city || ''))).filter(Boolean).sort();
  }

  formatNumber(value: number | undefined | null): string {
    if (value === undefined || value === null) return '-';
    return Math.round(value).toLocaleString('en-US');
  }

  formatCurrency(value: number | undefined | null): string {
    if (value === undefined || value === null) return '-';
    return `$${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  formatPercentage(value: number | undefined | null): string {
    if (value === undefined || value === null) return '-';
    return `${value.toFixed(2)}%`;
  }

  formatMonth(value: string | undefined | null): string {
    if (!value) return '-';

    if (value.includes('avg')) return value;

    const date = new Date(value);
    if (isNaN(date.getTime())) return value;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `${year}-${month}`;
  }

  get isAggregatedView(): boolean {
    return this.timePeriodControl.value !== 'all';
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  resetFilters(): void {
    this.searchControl.setValue('');
    this.regionControl.setValue('all');
    this.countryControl.setValue('all');
    this.cityControl.setValue('all');
    this.timePeriodControl.setValue('all');
  }

  retry(): void {
    this.loadRegionalData();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.showGoToTop = window.pageYOffset > this.SCROLL_THRESHOLD;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
