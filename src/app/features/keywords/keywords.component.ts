import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, inject, DestroyRef, HostListener } from '@angular/core';
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
import { MatChipsModule } from '@angular/material/chips';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { MetricsService } from '../../core/services';
import { KeywordMetrics } from '../../core/models';

/**
 * Filter state for keyword table
 */
interface FilterState {
  search: string;
  category: string;
  aiOverview: string;
}

/**
 * Keywords component displaying keyword performance metrics with year-over-year comparison
 * Features advanced filtering, sorting, and search capabilities
 */
@Component({
  selector: 'app-keywords',
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
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './keywords.component.html',
  styleUrls: ['./keywords.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class KeywordsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'keyword',
    'category',
    'trafficChangeYoY',
    'traffic2024',
    'traffic2025',
    'conversionRate2024',
    'conversionRate2025',
    'position2024',
    'position2025',
    'positionChange',
    'aiOverviewTriggered'
  ];

  dataSource = new MatTableDataSource<KeywordMetrics>([]);
  loading = false;
  error: string | null = null;
  categories: string[] = [];

  searchControl = new FormControl('');
  categoryControl = new FormControl('all');
  aiOverviewControl = new FormControl('all');
  private filterState: FilterState = { search: '', category: 'all', aiOverview: 'all' };

  showGoToTop: boolean = false;
  private readonly SCROLL_THRESHOLD = 300;

  private destroyRef = inject(DestroyRef);

@ViewChild(MatSort) sort!: MatSort;
@ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private metricsService: MetricsService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadKeywordData();
    this.setupFilterListeners();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = 10;
    this.dataSource.filterPredicate = this.createFilterPredicate();
  }

  loadKeywordData(): void {
    this.loading = true;
    this.error = null;
    this.cdr.markForCheck();

    this.metricsService.getKeywordMetrics()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          const mapped = this.mapKeywordData(data);
          this.dataSource.data = mapped;
          this.extractCategories(data);
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.error = err.message || 'Failed to load keyword metrics';
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  /**
   * Map and enrich keyword data with formatted values and CSS classes
   */
  private mapKeywordData(data: KeywordMetrics[]): KeywordMetrics[] {
    return data.map(item => ({
      ...item,
      formattedTraffic2024: this.formatNumber(item.traffic2024),
      formattedTraffic2025: this.formatNumber(item.traffic2025),
      formattedConversion2024: this.formatPercentage(item.conversionRate2024),
      formattedConversion2025: this.formatPercentage(item.conversionRate2025),
      formattedTrafficChange: this.formatTrafficChange(item.trafficChangeYoY),
      trafficChangeClass: this.getTrafficChangeClass(item.trafficChangeYoY),
      formattedPositionChange: this.formatPositionChange(item.positionChange),
      positionChangeClass: this.getPositionChangeClass(item.positionChange),
      aiClass: this.getAiOverviewClass(item.aiOverviewTriggered)
    }));
  }

  private extractCategories(data: KeywordMetrics[]): void {
    this.categories = Array.from(new Set(data.map(d => d.category || ''))).filter(Boolean).sort();
  }

  private setupFilterListeners(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.filterState.search = value || '';
        this.applyFilters();
      });

    this.categoryControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.filterState.category = value || 'all';
        this.applyFilters();
      });

    this.aiOverviewControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.filterState.aiOverview = value || 'all';
        this.applyFilters();
      });
  }

  private createFilterPredicate() {
    return (data: KeywordMetrics, filter: string): boolean => {
      const filterObj: FilterState = JSON.parse(filter);
      const t = filterObj.search.toLowerCase();

      const searchMatch =
        !t ||
        (data.keyword?.toLowerCase().includes(t) ||
         data.category?.toLowerCase().includes(t) ||
         data.aiOverviewTriggered?.toLowerCase().includes(t) ||
         data.traffic2024?.toString().includes(t) ||
         data.traffic2025?.toString().includes(t) ||
         data.trafficChangeYoY?.toString().includes(t) ||
         data.conversionRate2024?.toString().includes(t) ||
         data.conversionRate2025?.toString().includes(t) ||
         data.position2024?.toString().includes(t) ||
         data.position2025?.toString().includes(t) ||
         data.positionChange?.toString().includes(t)
        );

      const categoryMatch = filterObj.category === 'all' || data.category === filterObj.category;
      const aiOverviewMatch = filterObj.aiOverview === 'all' || data.aiOverviewTriggered === filterObj.aiOverview;

      return !!searchMatch && !!categoryMatch && !!aiOverviewMatch;
    };
  }

  private applyFilters(): void {
    this.dataSource.filter = JSON.stringify(this.filterState);
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  resetFilters(): void {
    this.searchControl.setValue('');
    this.categoryControl.setValue('all');
    this.aiOverviewControl.setValue('all');
  }

  retry(): void {
    this.loadKeywordData();
  }

  getTrafficChangeClass(value: number | undefined | null): string {
    if (value === undefined || value === null) return '';
    if (value === 0) return 'neutral';
    return value > 0 ? 'positive' : 'negative';
  }

  formatTrafficChange(value: number | undefined | null): string {
    if (value === undefined || value === null) return '-';
    const formatted = this.formatPercentage(value);
    if (value > 0) return `▲ ${formatted}`;
    if (value < 0) return `▼ ${formatted}`;
    return formatted;
  }

  formatPositionChange(value: number | undefined | null): string {
    if (value === undefined || value === null) return '-';
    if (value === 0) return '0';
    return value < 0 ? `${value} ▼` : `+${value} ▲`;
  }

  getPositionChangeClass(value: number | undefined | null): string {
    if (value === undefined || value === null) return '';
    if (value === 0) return 'neutral';
    return value < 0 ? 'negative' : 'positive';
  }

  formatNumber(value: number | undefined | null): string {
    if (value === undefined || value === null) return '-';
    return value.toLocaleString('en-US');
  }

  formatPercentage(value: number | undefined | null): string {
    if (value === undefined || value === null) return '-';
    return `${value.toFixed(2)}%`;
  }

  getAiOverviewClass(value: string | undefined): string {
    return value?.toLowerCase() === 'yes' ? 'ai-yes' : 'ai-no';
  }

  trackByKeyword(index: number, item: KeywordMetrics) {
    return item.keyword;
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.showGoToTop = window.pageYOffset > this.SCROLL_THRESHOLD;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
