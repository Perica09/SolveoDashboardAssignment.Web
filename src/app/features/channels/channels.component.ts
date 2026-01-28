import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
  DestroyRef,
  signal,
  HostListener
} from '@angular/core';
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
import { ChannelMonthlyMetrics } from '../../core/models';

/**
 * Filter state for the channels table
 */
interface FilterState {
  search: string;
  year: string;
  month: string;
  channel: string;
}

/**
 * Month option for the month filter dropdown
 */
interface MonthOption {
  value: string;
  label: string;
}

/**
 * Channels Component
 * 
 * Displays channel performance metrics in a sortable, filterable table.
 * Uses OnPush change detection for optimal performance.
 * All data formatting is done at the template level.
 */
@Component({
  selector: 'app-channels',
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
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChannelsComponent implements OnInit, AfterViewInit {
  
  // Table configuration
  readonly displayedColumns: string[] = [
    'month',
    'channel',
    'sessions',
    'signups',
    'conversionRate',
    'avgSessionDurationSec',
    'bounceRate',
    'pagesPerSession'
  ];

  // Data source - uses raw ChannelMonthlyMetrics
  dataSource = new MatTableDataSource<ChannelMonthlyMetrics>([]);
  
  // Reactive state using signals
  loading = signal(false);
  error = signal<string | null>(null);
  
  // Filter options
  years = signal<string[]>([]);
  readonly months: MonthOption[] = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];
  channels = signal<string[]>([]);

  // Form controls with non-nullable values
  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly yearControl = new FormControl('all', { nonNullable: true });
  readonly monthControl = new FormControl('all', { nonNullable: true });
  readonly channelControl = new FormControl('all', { nonNullable: true });
  
  private filterState: FilterState = {
    search: '',
    year: 'all',
    month: 'all',
    channel: 'all'
  };

  // Go to top button
  showGoToTop: boolean = false;
  private readonly SCROLL_THRESHOLD = 300;

  // Dependency injection
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private readonly metricsService: MetricsService) {}

  ngOnInit(): void {
    this.loadChannelData();
    this.setupFilterListeners();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = 10;
    this.dataSource.filterPredicate = this.createFilterPredicate();
    this.cdr.markForCheck();
  }

  /**
   * Load channel data from the API
   * Uses raw data without any transformations
   */
  private loadChannelData(): void {
    this.loading.set(true);
    this.error.set(null);

    this.metricsService.getAllChannelMetrics()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          // Store raw data directly - no mapping needed
          this.dataSource.data = data;
          this.extractFilterOptions(data);
          this.loading.set(false);
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.error.set(err.message || 'Failed to load channel metrics');
          this.loading.set(false);
          this.cdr.markForCheck();
        }
      });
  }

  /**
   * Setup listeners for all filter controls
   */
  private setupFilterListeners(): void {
    // Search with debounce
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(value => {
        this.filterState.search = value;
        this.applyFilters();
      });

    // Year filter
    this.yearControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.filterState.year = value;
        this.applyFilters();
      });

    // Month filter
    this.monthControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.filterState.month = value;
        this.applyFilters();
      });

    // Channel filter
    this.channelControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.filterState.channel = value;
        this.applyFilters();
      });
  }

  /**
   * Create custom filter predicate for the table
   */
  private createFilterPredicate(): (data: ChannelMonthlyMetrics, filter: string) => boolean {
    return (data: ChannelMonthlyMetrics, filter: string): boolean => {
      const filterObj: FilterState = JSON.parse(filter);
      const searchTerm = filterObj.search.toLowerCase();

      // Search match across all text and numeric fields
      const searchMatch = !searchTerm ||
        data.channel.toLowerCase().includes(searchTerm) ||
        data.month.toLowerCase().includes(searchTerm) ||
        data.sessions.toString().includes(searchTerm) ||
        data.signups.toString().includes(searchTerm);

      // Year filter - extract year from month field
      let yearMatch = filterObj.year === 'all';
      if (!yearMatch && data.month) {
        const year = data.month.split('-')[0];
        yearMatch = year === filterObj.year;
      }

      // Month filter - extract month from month field
      let monthMatch = filterObj.month === 'all';
      if (!monthMatch && data.month) {
        const month = data.month.split('-')[1];
        monthMatch = month === filterObj.month;
      }

      // Channel filter
      const channelMatch = filterObj.channel === 'all' || data.channel === filterObj.channel;

      return searchMatch && yearMatch && monthMatch && channelMatch;
    };
  }

  /**
   * Apply current filter state to the table
   */
  private applyFilters(): void {
    this.dataSource.filter = JSON.stringify(this.filterState);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Extract unique filter options from the data
   */
  private extractFilterOptions(data: ChannelMonthlyMetrics[]): void {
    // Extract unique years from month field
    const yearSet = new Set<string>();
    data.forEach(item => {
      if (item.month) {
        const year = item.month.split('-')[0];
        yearSet.add(year);
      }
    });
    this.years.set(Array.from(yearSet).sort());

    // Extract unique channels
    const channelSet = new Set(data.map(d => d.channel).filter(Boolean));
    this.channels.set(Array.from(channelSet).sort());
  }

  /**
   * Format a number with thousand separators
   * @param value - Number to format
   * @returns Formatted string or '-' if null/undefined
   */
  formatNumber(value: number | null | undefined): string {
    if (value === null || value === undefined) return '-';
    return Math.round(value).toLocaleString('en-US');
  }

  /**
   * Format a number as a percentage with 2 decimal places
   * @param value - Number to format (e.g., 3.09)
   * @returns Formatted percentage string (e.g., "3.09%")
   */
  formatPercentage(value: number | null | undefined): string {
    if (value === null || value === undefined) return '-';
    return `${value.toFixed(2)}%`;
  }

  /**
   * Format seconds as MM:SS
   * @param seconds - Duration in seconds
   * @returns Formatted duration string (e.g., "5:42")
   */
  formatDuration(seconds: number | null | undefined): string {
    if (seconds === null || seconds === undefined) return '-';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Format a decimal number with specified decimal places
   * @param value - Number to format
   * @param decimals - Number of decimal places (default: 1)
   * @returns Formatted decimal string
   */
  formatDecimal(value: number | null | undefined, decimals: number = 1): string {
    if (value === null || value === undefined) return '-';
    return value.toFixed(decimals);
  }

  /**
   * Format bounce rate from decimal to percentage
   * @param rate - Bounce rate as decimal (0-1, e.g., 0.56)
   * @returns Formatted percentage string (e.g., "56.00%")
   */
  formatBounceRate(rate: number | null | undefined): string {
    if (rate === null || rate === undefined) return '-';
    return `${(rate * 100).toFixed(2)}%`;
  }

  /**
   * Format month string (pass-through for now)
   * @param value - Month string in YYYY-MM format
   * @returns Formatted month string
   */
  formatMonth(value: string | null | undefined): string {
    if (!value) return '-';
    return value;
  }

  /**
   * Clear the search input
   */
  clearSearch(): void {
    this.searchControl.setValue('');
  }

  /**
   * Reset all filters to their default values
   */
  resetFilters(): void {
    this.searchControl.setValue('');
    this.yearControl.setValue('all');
    this.monthControl.setValue('all');
    this.channelControl.setValue('all');
  }

  /**
   * Retry loading data after an error
   */
  retry(): void {
    this.loadChannelData();
  }

  /**
   * TrackBy function for table rows
   * Improves performance by helping Angular track row identity
   */
  trackByChannelMonth(index: number, item: ChannelMonthlyMetrics): string {
    return `${item.channel}-${item.month}`;
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.showGoToTop = window.pageYOffset > this.SCROLL_THRESHOLD;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
