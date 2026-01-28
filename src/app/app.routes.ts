import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },
  {
    path: 'keywords',
    loadComponent: () =>
      import('./features/keywords/keywords.component')
        .then(m => m.KeywordsComponent)
  },
  {
    path: 'regions',
    loadComponent: () =>
      import('./features/regions/regions.component')
        .then(m => m.RegionsComponent)
  },
  {
    path: 'channels',
    loadComponent: () =>
      import('./features/channels/channels.component')
        .then(m => m.ChannelsComponent)
  },
  {
    path: 'alerts',
    loadComponent: () =>
      import('./features/alerts/alerts.component')
        .then(m => m.AlertsComponent)
  }
];
