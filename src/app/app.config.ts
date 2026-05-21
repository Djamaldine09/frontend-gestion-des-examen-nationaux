import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { 
  SocialLoginModule,
  SocialAuthServiceConfig, 
  GoogleLoginProvider,
  SOCIAL_AUTH_CONFIG
} from '@abacritt/angularx-social-login';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from './core/interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    importProvidersFrom(SocialLoginModule),
    {
      // Utilise le token officiel au lieu de la chaîne de caractères
      provide: 'SocialAuthServiceConfig', 
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleClientId),
          },
        ],
        onError: (err) => {
          console.error('Erreur Social Login:', err);
        },
      } as SocialAuthServiceConfig,
    }
  ]
};