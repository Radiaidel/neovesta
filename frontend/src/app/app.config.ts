import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding } from "@angular/router"
import { provideHttpClient, withInterceptors } from "@angular/common/http"
import { authInterceptor } from "./interceptors/auth.interceptor"
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { userReducer } from './store/user.reducer';
import { UserEffects } from './store/user.effects';
import { residenceReducer } from './store/residence/residence.reducer';
import { ResidenceEffects } from './store/residence/residence.effects';
import { contractReducer } from './store/contract/contract.reducer';
import { ContractEffects } from './store/contract/contract.effects';
import { provideAnimations } from "@angular/platform-browser/animations"
import { featureReducer } from './store/feature/feature.reducer';
import { FeatureEffects } from './store/feature/feature.effects';
import { reservationReducer } from './store/reservation/reservation.reducer';
import { ReservationEffects } from './store/reservation/reservation.effects';
import { subscriptionReducer } from './store/subscription/subscription.reducer';
import { SubscriptionEffects } from './store/subscription/subscription.effects';

export const appConfig: ApplicationConfig = {

  
providers: [
  provideRouter(routes),
  provideHttpClient(withInterceptors([authInterceptor])),
  provideStore({
    users: userReducer,
    residences: residenceReducer,
    contract: contractReducer,
    feature: featureReducer,
    reservations : reservationReducer,
    subscriptions : subscriptionReducer

  }),
  provideEffects([UserEffects , ResidenceEffects , ContractEffects , FeatureEffects , ReservationEffects, SubscriptionEffects]),
  provideAnimations(),
  provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
],
};
