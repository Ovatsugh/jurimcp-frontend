import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHighlightOptions } from 'ngx-highlightjs';

import { routes } from './app.routes';
import { authInterceptor } from './shared/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'top' })),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideHighlightOptions({
      fullLibraryLoader: () => import('highlight.js'),
    }),
  ]
};
