import { APP_INITIALIZER, ApplicationConfig, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { PreloadAllModules, RouteReuseStrategy, provideRouter, withInMemoryScrolling, withPreloading } from '@angular/router';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { HttpClient,provideHttpClient, withInterceptors, withInterceptorsFromDi, withJsonpSupport } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth-header.interceptor';
import { tokenInterceptor } from './interceptors/token.interceptor';
import { AuthenticationService } from './services/authentication.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AuthNegativoGuard } from './guards/auth-negativo.guard';
import { AuthGuard } from './guards/auth.guard';
import { StorageService } from './services/storage.service';
import { APP_BASE_HREF, IMAGE_CONFIG } from '@angular/common';
import { provideQuillConfig } from 'ngx-quill';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { LocationService } from './services/location.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],
    ['clean'], // remove formatting button
  ]
};

const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

const appearance: MatFormFieldDefaultOptions = {
  appearance: 'outline'
};
 
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
    { provide: APP_BASE_HREF, useValue: '/'},
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true, 
        disableImageLazyLoadWarning: true
      }
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: appearance
    },
    provideRouter(routes, withInMemoryScrolling({scrollPositionRestoration: 'enabled'}), withPreloading(PreloadAllModules)),
    provideClientHydration(),
    provideAnimations(),
    provideToastr(),
    provideHttpClient(),
    provideQuillConfig({modules}),
    AuthenticationService,
    AuthGuard,
    AuthNegativoGuard,
    StorageService,
    LocationService,
    provideHttpClient(withJsonpSupport()),
    importProvidersFrom(TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })),
    tokenInterceptor,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      multi: true,
      deps: [AuthenticationService, StorageService],
    },
    provideHttpClient(
      withInterceptors([authInterceptor]),
      withInterceptorsFromDi()
    ),
  ]
};

export function appInitializerFactory(authService: AuthenticationService) {
  return () => authService.checkTheUserOnTheFirstLoad();
}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}