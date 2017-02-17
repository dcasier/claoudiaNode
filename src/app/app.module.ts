import { NgModule,
         ApplicationRef }   from '@angular/core';
import { BrowserModule }    from '@angular/platform-browser';
import { FormsModule }      from '@angular/forms';
import { HttpModule }       from '@angular/http';
import { RouterModule }     from '@angular/router';
import { removeNgStyles,
         createNewHosts,
         createInputTransfer }  from '@angularclass/hmr';
import { MaterialModule }       from '@angular/material';

import { FileSelectDirective,
         FileDropDirective }    from 'ng2-file-upload';

import { ENV_PROVIDERS }        from './environment';
import { ROUTES }               from './app.routes';

import { AppComponent }         from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, 
         InternalStateType }  from './app.service';
import { HomeComponent,
         LoginComponent,
         ToolbarComponent,
	     EventComponent,
	     EventAddComponent } 	  from './components';

import { SphereRelation }     from './services/relation.service/sphere.relation';
import { SphereAction }       from './services/action.service/sphere.action';
import { SphereValidation }   from './services/action.service/sphere.validation';
import { RelationService }    from './services/relation.service';
import { ActionService }      from './services/action.service';
import { provideStore }       from '@ngrx/store';
import { store }              from './services/reducer/index';

import { UploadService }      from './services/upload.service';
import { ApiRest } 	          from './services/apirest';
import { ContextService }     from './services/context.service';
import { JsonService }        from './services/json.service';
import { SphereAPI }          from './services/json.service/sphere.api';

import { AddEventDialog }     from './components/home.component';
import { AddSphereDialog }    from './components/toolbar.component';
import { LoginDialog }        from './components/toolbar.component';
import { RegisterDialog }     from './components/toolbar.component';

import { HttpInterceptorModule } from 'ng2-http-interceptor';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ToolbarComponent,
    EventComponent,
    EventAddComponent,
    AddSphereDialog,
    AddEventDialog,
    LoginDialog,
    RegisterDialog,
    FileSelectDirective
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, { useHash: true }),
    HttpInterceptorModule,
    MaterialModule.forRoot(),
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    SphereRelation,
    SphereAction,
    SphereValidation,
    ActionService,
    RelationService,
    UploadService,
    ApiRest,
    JsonService,
    ContextService,
    SphereAPI,
    ENV_PROVIDERS,
    APP_PROVIDERS,
    provideStore(store)
  ],
  entryComponents: [
    AddSphereDialog,
    AddEventDialog,
    LoginDialog,
    RegisterDialog
  ]
})
export class AppModule {
  constructor(public appRef: ApplicationRef, public appState: AppState) {}

  hmrOnInit(store: StoreType) {
    if (!store || !store.state) return;
    console.log('HMR store', JSON.stringify(store, null, 2));
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // save state
    const state = this.appState._state;
    store.state = state;
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues  = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}

