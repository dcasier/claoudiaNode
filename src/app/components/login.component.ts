import { Component
          }        from '@angular/core';

import { Store }            from '@ngrx/store';

import { ActionService }    from '../services/action.service';


@Component({
  selector: 'login',
  styleUrls: [  ],
  template: `Hello World`
})
export class LoginComponent {

  constructor(
    public store:    Store<any>,
    public actionservice:    ActionService) {
  }
  
}

