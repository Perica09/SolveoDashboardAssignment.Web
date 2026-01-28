import { Component, OnInit, OnDestroy, HostListener, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { MetricsService, AlertsService } from '../../core/services';
import { 
  DashboardState, 
  SectionState, 
  FunnelData, 
  ChartDataPoint,
  TableColumn, 
  Alert
} from '../../core/models';

import { MetricCardComponent } from '../../shared/components/metric-card/metric-card.component';
import { LineChartComponent } from '../../shared/components/line-chart/line-chart.component';
import { FunnelChartComponent } from '../../shared/components/funnel-chart/funnel-chart.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { AlertBadgeComponent } from '../../shared/components/alert-badge/alert-badge.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';

/**
 * Main dashboard component displaying executive summary, charts, tables, and alerts
 * Features dynamic table row calculation and responsive layout
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MetricCardComponent,
    LineChartComponent,
    FunnelChartComponent,
    DataTableComponent,
    AlertBadgeComponent,
    MatTabsModule,
    MatButtonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  // UI constants
  private readonly SCROLL_THRESHOLD = 300;
  private readonly RESIZE_DEBOUNCE_MS = 150;
  private readonly LAYOUT_REFLOW_DELAY_MS = 100;
  private readonly TABLE_CALCULATION_DELAY_MS = 350;
  private readonly MOBILE_BREAKPOINT = 1024;
  private readonly DEFAULT_TABLE_ROWS = 10;
  private readonly MIN_TABLE_ROWS = 5;
  private readonly MAX_TABLE_ROWS = 30;
  private readonly TABLE_BUFFER_HEIGHT = 20;

  state: DashboardState = {
    executiveSummary: this.createSectionState(),
    mrrGrowth: this.createSectionState(),
    trafficTrends: this.createSectionState(),
    conversionFunnel: this.createSectionState(),
    keywords: this.createSectionState(),
    regions: this.createSectionState(),
    channels: this.createSectionState(),
    alerts: this.createSectionState()
  };

  keywordColumns: TableColumn[] = [
    { key: 'keyword', label: 'Keyword', sortable: true, type: 'text' },
    { key: 'traffic', label: 'Traffic', sortable: true, type: 'number' },
    { key: 'conversionRate', label: 'Conv. Rate', sortable: true, type: 'percentage' },
    { key: 'position', label: 'Position', sortable: true, type: 'number' },
    { key: 'positionChange', label: 'Position Δ', sortable: true, type: 'number' }
  ];

  regionColumns: TableColumn[] = [
    { key: 'region', label: 'Region', sortable: true, type: 'text' },
    { key: 'sessions', label: 'Sessions', sortable: true, type: 'number' },
    { key: 'conversions', label: 'Conversions', sortable: true, type: 'number' },
    { key: 'revenue', label: 'Revenue', sortable: true, type: 'currency' },
    { key: 'averageTrialToPaidRate', label: 'Avg Trial→Paid %', sortable: true, type: 'number' },
    { key: 'trafficTrendPercentage', label: 'Traffic Trend %', sortable: true, type: 'number' }
  ];

  channelColumns: TableColumn[] = [
    { key: 'channel', label: 'Channel', sortable: true, type: 'text' },
    { key: 'sessions', label: 'Sessions', sortable: true, type: 'number' },
    { key: 'conversions', label: 'Conversions', sortable: true, type: 'number' },
    { key: 'conversionRate', label: 'Conv. Rate', sortable: true, type: 'percentage' },
  ];

  severities: Array<'Critical' | 'High' | 'Medium' | 'Low'> = ['Critical', 'High', 'Medium', 'Low'];
  alertsBySeverity: { [key: string]: Alert[] } = {
    Critical: [],
    High: [],
    Medium: [],
    Low: []
  };
  showLimit: { [key: string]: number } = {};
  defaultTabIndex: number = 0;
  keywordMaxRows: number = 12;
  private resizeTimeout: ReturnType<typeof setTimeout> | null = null;
  showGoToTop: boolean = false;

  constructor(
    private metricsService: MetricsService,
    private alertsService: AlertsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngAfterViewInit(): void {
    // Initial calculation after view is ready
    setTimeout(() => this.calculateTableRows(), this.LAYOUT_REFLOW_DELAY_MS);
  }

  ngOnDestroy(): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          this.calculateTableRows();
        }, this.LAYOUT_REFLOW_DELAY_MS);
      });
    }, this.RESIZE_DEBOUNCE_MS);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.showGoToTop = window.pageYOffset > this.SCROLL_THRESHOLD;
  }

  private createSectionState<T>(): SectionState<T> {
    return {
      loading: false,
      error: null,
      data: null
    };
  }

  loadDashboardData(): void {
    this.loadExecutiveSummary();
    this.loadMrrGrowth();
    this.loadTrafficTrends();
    this.loadConversionFunnel();
    this.loadKeywords();
    this.loadRegions();
    this.loadChannels();
    this.loadAlerts();
  }

  loadExecutiveSummary(): void {
    this.state.executiveSummary.loading = true;
    this.state.executiveSummary.error = null;

    this.metricsService.getLatestMonthlyMetrics().subscribe({
      next: (data) => {
        this.state.executiveSummary.data = data as any;
        this.state.executiveSummary.loading = false;
      },
      error: (err) => {
        this.state.executiveSummary.error = err.message || 'Failed to load executive summary';
        this.state.executiveSummary.loading = false;
      }
    });
  }

  loadMrrGrowth(): void {
    this.state.mrrGrowth.loading = true;
    this.state.mrrGrowth.error = null;

    this.metricsService.getMrrHistory(12).subscribe({
      next: (data) => {
        this.state.mrrGrowth.data = data.map(d => ({
          label: String(d.month), 
          value: Number(d.mrrUsd)
        }));
        this.state.mrrGrowth.loading = false;
      },
      error: (err) => {
        this.state.mrrGrowth.error = err.message || 'Failed to load MRR history';
        this.state.mrrGrowth.loading = false;
      }
    });
  }

  loadTrafficTrends(): void {
    this.state.trafficTrends.loading = true;
    this.state.trafficTrends.error = null;

    this.metricsService.getMonthlyMetrics().subscribe({
      next: (data) => {
        this.state.trafficTrends.data = data.map(item => ({
          label: item.month,
          value: Number(item['websiteTraffic'] || 0)
        }));
        this.state.trafficTrends.loading = false;
      },
      error: (err) => {
        this.state.trafficTrends.error = err.message || 'Failed to load traffic trends';
        this.state.trafficTrends.loading = false;
      }
    });
  }

  loadConversionFunnel(): void {
  this.state.conversionFunnel.loading = true;
  this.state.conversionFunnel.error = null;

  this.metricsService.getLatestMonthlyMetrics().subscribe({
    next: (data) => {
      const websiteTraffic = data['websiteTraffic'] || 0;
      const uniqueSignups = data['uniqueSignups'] || 0;
      const trialsStarted = data['trialsStarted'] || 0;
      const paidConversions = data['paidConversions'] || 0;

      const funnelData = [
        {
          stage: 'Website Traffic',
          value: websiteTraffic,
          percentage: 100,
          label: `${websiteTraffic} (100%)`,
          color: '#4caf50'
        },
        {
          stage: 'Unique Signups',
          value: uniqueSignups,
          percentage: websiteTraffic > 0 ? (uniqueSignups / websiteTraffic) * 100 : 0,
          label: `${uniqueSignups} (${((uniqueSignups / websiteTraffic) * 100).toFixed(1)}%)`,
          color: '#8bc34a'
        },
        {
          stage: 'Trials Started',
          value: trialsStarted,
          percentage: websiteTraffic > 0 ? (trialsStarted / websiteTraffic) * 100 : 0,
          label: `${trialsStarted} (${((trialsStarted / websiteTraffic) * 100).toFixed(1)}%)`,
          color: '#cddc39'
        },
        {
          stage: 'Paid Conversions',
          value: paidConversions,
          percentage: websiteTraffic > 0 ? (paidConversions / websiteTraffic) * 100 : 0,
          label: `${paidConversions} (${((paidConversions / websiteTraffic) * 100).toFixed(1)}%)`,
          color: '#ffc107'
        }
      ];

      this.state.conversionFunnel.data = funnelData;
      this.state.conversionFunnel.loading = false;
    },
    error: (err) => {
      this.state.conversionFunnel.error = err.message || 'Failed to load conversion funnel';
      this.state.conversionFunnel.loading = false;
    }
  });
}

  loadKeywords(): void {
    this.state.keywords.loading = true;
    this.state.keywords.error = null;

    this.metricsService.getKeywordMetrics().subscribe({
      next: (data) => {
        this.state.keywords.data = data.map(k => ({
          keyword: k.keyword,
          traffic: k.traffic2025,
          conversionRate: k.conversionRate2025,
          position: k.position2025,
          trafficChange: k.trafficChangeYoY,
          positionChange: k.positionChange,
          aiOverview: k.aiOverviewTriggered
        }));

        this.state.keywords.loading = false;
      },
      error: (err) => {
        this.state.keywords.error = err.message || 'Failed to load keywords';
        this.state.keywords.loading = false;
      }
    });
  }

  /**
   * Load and aggregate regional metrics by region
   */
  loadRegions(): void {
    this.state.regions.loading = true;
    this.state.regions.error = null;

    this.metricsService.getRegionalMetrics().subscribe({
      next: (data) => {
        const aggregated = data.reduce((acc, item) => {
        let regionRow = acc.find(r => r.region === item.region);
        if (!regionRow) {
          regionRow = {
            region: item.region,
            sessions: 0,
            conversions: 0,
            revenue: 0,
            totalTraffic: 0,
            totalConversions: 0,
            sumTrialToPaidRate: 0,
            sumCacLtvRatio: 0,
            count: 0,
            trafficTrendPercentage: 0,
            averageTrialToPaidRate: 0,
            cacLtvRatio: 0
          };
          acc.push(regionRow);
        }

        regionRow.sessions += item.totalTraffic || 0;
        regionRow.conversions += item.totalConversions || 0;
        regionRow.revenue += (item.averageLtv || 0) * (item.totalConversions || 0);
        regionRow.sumTrialToPaidRate += item.averageTrialToPaidRate || 0;
        regionRow.sumCacLtvRatio += item.cacLtvRatio || 0;
        regionRow.trafficTrendPercentage += item.trafficTrendPercentage || 0;
        regionRow.count += 1;

        return acc;
      }, [] as any[]);

      aggregated.forEach(r => {
        r.averageTrialToPaidRate = r.sumTrialToPaidRate / r.count;
        r.cacLtvRatio = r.sumCacLtvRatio / r.count;
        r.trafficTrendPercentage = r.trafficTrendPercentage / r.count;
      });

      this.state.regions.data = aggregated;
      this.state.regions.loading = false;
      this.calculateTableRows();
    },
    error: (err) => {
      this.state.regions.error = err.message || 'Failed to load regions';
      this.state.regions.loading = false;
    }
  });
}


  loadChannels(): void {
    this.state.channels.loading = true;
    this.state.channels.error = null;

    this.metricsService.getChannelMetrics().subscribe({
      next: (data) => {
        this.state.channels.data = data.map(d => ({
          ...d,  
          channel: d.channel,
          sessions: d['totalSessions'],
          conversions: d['totalSignups'],
          conversionRate: d['conversionRate']
        }));
        this.state.channels.loading = false;
        this.calculateTableRows();
      },
      error: (err) => {
        this.state.channels.error = err.message || 'Failed to load channels';
        this.state.channels.loading = false;
      }
    });
  }

  /**
   * Calculate dynamic table rows based on available viewport height
   * Adjusts keyword table rows to match the height of the right column
   */
  calculateTableRows(): void {
    if (window.innerWidth < this.MOBILE_BREAKPOINT) {
      if (this.keywordMaxRows !== this.DEFAULT_TABLE_ROWS) {
        this.keywordMaxRows = this.DEFAULT_TABLE_ROWS;
        this.cdr.detectChanges();
      }
      return;
    }

    setTimeout(() => {
      const rightColumn = document.querySelector('.right-column') as HTMLElement;
      const keywordsTableContainer = document.querySelector('.tables-grid > .table-card:first-child') as HTMLElement;
      
      if (!rightColumn || !keywordsTableContainer) {
        setTimeout(() => this.calculateTableRows(), this.LAYOUT_REFLOW_DELAY_MS);
        return;
      }

      const rightColumnHeight = rightColumn.clientHeight;
      if (rightColumnHeight < 100) {
        setTimeout(() => this.calculateTableRows(), this.LAYOUT_REFLOW_DELAY_MS);
        return;
      }
      
      const keywordsTableElement = keywordsTableContainer.querySelector('.table-container') as HTMLElement;
      if (!keywordsTableElement) {
        if (this.keywordMaxRows !== this.DEFAULT_TABLE_ROWS) {
          this.keywordMaxRows = this.DEFAULT_TABLE_ROWS;
          this.cdr.detectChanges();
        }
        return;
      }

      const computedStyle = window.getComputedStyle(keywordsTableElement);
      const paddingTop = parseFloat(computedStyle.paddingTop);
      const paddingBottom = parseFloat(computedStyle.paddingBottom);
      
      const header = keywordsTableElement.querySelector('h3') as HTMLElement;
      const headerHeight = header ? header.offsetHeight : 40;
      
      const firstRow = keywordsTableElement.querySelector('tbody tr') as HTMLElement;
      const rowHeight = firstRow ? firstRow.offsetHeight : 48;
      
      const thead = keywordsTableElement.querySelector('thead') as HTMLElement;
      const theadHeight = thead ? thead.offsetHeight : 40;
      
      const availableHeight = rightColumnHeight - paddingTop - paddingBottom - headerHeight - theadHeight - this.TABLE_BUFFER_HEIGHT;
      const calculatedRows = Math.floor(availableHeight / rowHeight);
      const newMaxRows = Math.max(this.MIN_TABLE_ROWS, Math.min(this.MAX_TABLE_ROWS, calculatedRows));
      
      this.keywordMaxRows = newMaxRows;
      this.cdr.detectChanges();
    }, this.TABLE_CALCULATION_DELAY_MS);
  }

  loadAlerts(): void {
    this.state.alerts.loading = true;
    this.state.alerts.error = null;

    this.alertsService.getAlerts().subscribe({
      next: (data) => {
        const mappedAlerts: Alert[] = data.map(a => ({
          message: a.message,
          severity: a.severity,
          detectedAt: a.detectedAt,
          recommendedAction: a.recommendedAction,
          alertType: a.alertType,
          entity: a.entity,
          value: a.value,
          threshold: a.threshold
        }));

        this.state.alerts.data = mappedAlerts;

      this.groupAlertsBySeverity(mappedAlerts);
      this.defaultTabIndex = this.getDefaultTabIndex();

      this.state.alerts.loading = false;
    },
    error: (err) => {
      this.state.alerts.error = err.message || 'Failed to load alerts';
      this.state.alerts.loading = false;
    }
  });
}

  /**
   * Group alerts by severity and initialize display limits
   */
  private groupAlertsBySeverity(alerts: Alert[]) {
    this.severities.forEach(sev => {
      const filtered = alerts.filter(a => a.severity?.toLowerCase() === sev.toLowerCase());
      this.alertsBySeverity[sev] = filtered;
      this.showLimit[sev] = 5;
    });
  }

  showMoreAlerts(severity: string): void {
    this.showLimit[severity] = this.alertsBySeverity[severity].length;
  }

  showLessAlerts(severity: string): void {
    this.showLimit[severity] = 5;
  }

  /**
   * Determine which alert tab should be shown by default based on severity
   */
  getDefaultAlertTab(): 'Critical' | 'High' | 'Medium' | 'Low' {
    if (this.alertsBySeverity['Critical'].length > 0) return 'Critical';
    if (this.alertsBySeverity['High'].length > 0) return 'High';
    if (this.alertsBySeverity['Medium'].length > 0) return 'Medium';
    if (this.alertsBySeverity['Low'].length > 0) return 'Low';
    return 'Critical';
  }

  getDefaultTabIndex(): number {
    const defaultTab = this.getDefaultAlertTab();
    return this.severities.indexOf(defaultTab);
  }

  retryExecutiveSummary(): void {
    this.loadExecutiveSummary();
  }

  retryMrrGrowth(): void {
    this.loadMrrGrowth();
  }

  retryTrafficTrends(): void {
    this.loadTrafficTrends();
  }

  retryConversionFunnel(): void {
    this.loadConversionFunnel();
  }

  retryKeywords(): void {
    this.loadKeywords();
  }

  retryRegions(): void {
    this.loadRegions();
  }

  retryChannels(): void {
    this.loadChannels();
  }

  retryAlerts(): void {
    this.loadAlerts();
  }

  getTrend(value: number): 'up' | 'down' | 'neutral' {
    if (value > 0) return 'up';
    if (value < 0) return 'down';
    return 'neutral';
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
