import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Alert } from '../../../core/models';

/**
 * Alert badge component for displaying individual alerts with severity indicators
 * Supports compact mode for space-constrained layouts
 */
@Component({
  selector: 'app-alert-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-badge.component.html',
  styleUrls: ['./alert-badge.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertBadgeComponent {
  @Input() alert!: Alert;
  @Input() compact: boolean = false;

  get severityClass(): string {
    return `severity-${(this.alert.severity || 'low').toLowerCase()}`;
  }

  get severityIcon(): string {
    switch ((this.alert.severity || 'low').toLowerCase()) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🔵';
      default: return '⚪';
    }
  }

  formatAlertType(alertType?: string): string {
    if (!alertType) return '';
    return alertType
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  formatDate(timestamp: string): string {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
