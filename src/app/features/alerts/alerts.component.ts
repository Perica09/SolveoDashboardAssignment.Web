import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, inject, DestroyRef, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AlertsService } from '../../core/services';
import { Alert, DateRangeParams } from '../../core/models';

/**
 * Alerts component displaying system alerts with severity-based filtering
 * Supports multiple alert types and advanced search functionality
 */
@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
    MatTooltipModule
  ],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit, AfterViewInit {
  readonly displayedColumns: string[] = [
    'severity',
    'message',
    'alertType',
    'recommendedAction'
  ];

  dataSource = new MatTableDataSource<Alert>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  readonly severities: Array<'Critical' | 'High' | 'Medium' | 'Low'> = [
    'Critical',
    'High',
    'Medium',
    'Low'
  ];

  severityCounts = signal<Record<string, number>>({
    Critical: 0,
    High: 0,
    Medium: 0,
    Low: 0
  });

  activeSeverity = signal<string | null>(null);
  readonly searchControl = new FormControl('', { nonNullable: true });

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  selectedAlertType: string = 'all';
  dateRange: DateRangeParams = {};

  alertTypes = [
    { value: 'all', label: 'All Alerts' },
    { value: 'high-traffic', label: 'High Traffic, Low Conversion' },
    { value: 'ai-cannibalization', label: 'AI Overview Cannibalization' },
    { value: 'regional', label: 'Regional Underperformance' },
    { value: 'seasonal', label: 'Seasonal Dips' },
    { value: 'channel-waste', label: 'Channel Waste' }
  ];

  showGoToTop: boolean = false;
  private readonly SCROLL_THRESHOLD = 300;

  constructor(private alertsService: AlertsService) {}

  ngOnInit(): void {
    this.loadAlerts();
    this.setupSearchListener();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = 10;
    this.dataSource.filterPredicate = this.createFilterPredicate();
    this.dataSource.sortingDataAccessor = this.createSortingAccessor();
    this.cdr.markForCheck();
  }

  loadAlerts(): void {
    this.loading.set(true);
    this.error.set(null);

    const apiCall = this.getApiCallForAlertType();

    apiCall
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.dataSource.data = data;
          this.calculateSeverityCounts(data);
          this.loading.set(false);
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.error.set(err.message || 'Failed to load alerts');
          this.loading.set(false);
          this.cdr.markForCheck();
        }
      });
  }

  /**
   * Get the appropriate API call based on selected alert type filter
   */
  private getApiCallForAlertType() {
    switch (this.selectedAlertType) {
      case 'high-traffic':
        return this.alertsService.getHighTrafficLowConversion({ 
          minTraffic: 2000, 
          maxConversion: 1.5 
        });
      case 'ai-cannibalization':
        return this.alertsService.getAiOverviewCannibalization({ 
          minDeclinePercentage: 10.0 
        });
      case 'regional':
        return this.alertsService.getRegionalUnderperformance(this.dateRange);
      case 'seasonal':
        return this.alertsService.getSeasonalDips(this.dateRange);
      case 'channel-waste':
        return this.alertsService.getChannelWaste({
          maxConversion: 2.0,
          minSessions: 10000,
          ...this.dateRange
        });
      default:
        return this.alertsService.getAlerts(this.dateRange);
    }
  }

  private calculateSeverityCounts(alerts: Alert[]): void {
    const counts = alerts.reduce((acc, alert) => {
      acc[alert.severity] = (acc[alert.severity] || 0) + 1;
      return acc;
    }, {
      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0
    } as Record<string, number>);
    
    this.severityCounts.set(counts);
  }

  private setupSearchListener(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.applyFilters();
      });
  }

  private createFilterPredicate(): (alert: Alert, filter: string) => boolean {
    return (alert: Alert, filter: string): boolean => {
      const filterObj = JSON.parse(filter);
      
      // Severity filter
      const severityMatch = !filterObj.severity || 
        alert.severity === filterObj.severity;
      
      // Search filter
      const searchTerm = filterObj.search.toLowerCase();
      const searchMatch = !searchTerm ||
        alert.message.toLowerCase().includes(searchTerm) ||
        (alert.alertType || '').toLowerCase().includes(searchTerm) ||
        (alert.recommendedAction || '').toLowerCase().includes(searchTerm) ||
        (alert.entity || '').toLowerCase().includes(searchTerm);
      
      return severityMatch && searchMatch;
    };
  }

  private applyFilters(): void {
    const filterValue = JSON.stringify({
      severity: this.activeSeverity(),
      search: this.searchControl.value
    });
    
    this.dataSource.filter = filterValue;
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filterBySeverity(severity: string): void {
    if (this.activeSeverity() === severity) {
      this.activeSeverity.set(null);
    } else {
      this.activeSeverity.set(severity);
    }
    this.applyFilters();
  }

  clearSeverityFilter(): void {
    this.activeSeverity.set(null);
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  resetFilters(): void {
    this.searchControl.setValue('');
    this.activeSeverity.set(null);
    this.selectedAlertType = 'all';
    this.loadAlerts();
  }

  private createSortingAccessor(): (alert: Alert, property: string) => string | number {
    return (alert: Alert, property: string): string | number => {
      switch (property) {
        case 'severity':
          const severityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
          return severityOrder[alert.severity];
        case 'detectedAt':
          return new Date(alert.detectedAt).getTime();
        case 'message':
          return alert.message;
        case 'alertType':
          return alert.alertType || '';
        case 'recommendedAction':
          return alert.recommendedAction || '';
        default:
          return '';
      }
    };
  }

  getSeverityIcon(severity: string): string {
    switch (severity.toLowerCase()) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🔵';
      default: return '⚪';
    }
  }

  formatDate(timestamp: string): string {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatAlertType(alertType?: string): string {
    if (!alertType) return '-';
    return alertType
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  truncateText(text: string | undefined, maxLength: number = 130): string {
    if (!text) return '-';
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  }

  shouldShowTooltip(text: string | undefined, maxLength: number = 130): boolean {
    if (!text) return false;
    return text.length > maxLength;
  }

  trackByAlert(index: number, alert: Alert): string {
    return `${alert.severity}-${alert.detectedAt}-${alert.message}`;
  }

  onAlertTypeChange(): void {
    this.loadAlerts();
  }

  retry(): void {
    this.loadAlerts();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.showGoToTop = window.pageYOffset > this.SCROLL_THRESHOLD;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
