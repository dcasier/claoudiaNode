import { Component,
         ViewEncapsulation } from '@angular/core';

import { AppState }          from './app.service';

import { ActionService }     from './services/action.service';

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css',
    './theme.scss'
  ],
  templateUrl: 'app.component.html'
})
export class AppComponent {
  isDarkTheme: boolean = false;

  constructor(
    public actionservice: ActionService) {
    actionservice.action('load_cache', '');
  }

}
