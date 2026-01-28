import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

/**
 * Navigation item configuration
 */
interface NavItem {
  label: string;
  route: string;
  exact: boolean;
}

/**
 * Header component with navigation and search functionality
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  searchQuery: string = '';
  
  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', exact: true },
    { label: 'Keywords', route: '/keywords', exact: false },
    { label: 'Regions', route: '/regions', exact: false },
    { label: 'Channels', route: '/channels', exact: false },
    { label: 'Alerts', route: '/alerts', exact: false }
  ];

  constructor(private router: Router) {}

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  onSearch(): void {
    console.log('Searching for:', this.searchQuery);
  }
}
