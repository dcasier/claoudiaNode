import { Component,
         ViewEncapsulation } from '@angular/core';

import { Store }             from '@ngrx/store';

import { ActionService }     from '../services/action.service';
import { MdDialog,
         MdDialogRef,
         MdDialogConfig }    from '@angular/material';
         
import { Observable }        from 'rxjs/Observable';
import 'rxjs/add/observable/timer';

@Component({
  selector: 'toolbar',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
  ],
  template: `
    <md-toolbar color="primary">
        <div class="menu-section">
            <button md-mini-fab class="md-accent" (click)="open()">
                <md-icon>add</md-icon>
            </button>
            <button md-fab class="md-accent" (click)="open()">
                <md-icon>add</md-icon>
            </button>
            <template [ngIf]="cache?.lastspheres">
                <!--md-icon>ic_keyboard_arrow_right</md-icon-->
                <button md-icon-button [md-menu-trigger-for]="menu" aria-label="Open basic menu">
                    <md-icon>mode_edit</md-icon> 
                </button>
                <md-menu #menu="mdMenu">
                    <button md-menu-item *ngFor="let item of actionservice.text.edit_sphere" (click)="actionservice.action(item.name, cache.lastspheres[0])">
                        {{ item.tr }}
                    </button>
                </md-menu>
            </template>
        </div>
        <md-select placeholder="Ma sphère" [(ngModel)]="sphere" (ngModelChange)="setSphere($event)">
            <md-option *ngFor="let item of (store.select('sphere')| async).keys" [value]="item">
                {{ item }}
            </md-option>
        </md-select>
        <div>
            <md-icon>notifications</md-icon>
            <md-icon>mail</md-icon>
            <md-icon>person</md-icon>
            <span>Local(host)</span>
        </div>
    </md-toolbar>
    `
})

export class ToolbarComponent {
  dialogRef: MdDialogRef<AddSphereDialog>;
  loginDialog: MdDialogRef<LoginDialog>;
  registerDialog: MdDialogRef<RegisterDialog>;
  lastCloseResult: string;
  config: MdDialogConfig = {
    disableClose: false,
  };
  cache: any;

  open() {
    this.dialogRef = this.dialog.open(AddSphereDialog, this.config);
    this.dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.actionservice.action('add_sphere', result);
      }
      this.dialogRef = null;
    });
  }
  
  login() {
    this.loginDialog = this.dialog.open(LoginDialog, this.config);
    this.loginDialog.afterClosed().subscribe(result => {
      if(result) {
        if(result == "register"){
            this.register();
        }else {
            localStorage['token'] = result;
            console.log(localStorage['token']);
        }
      }
      this.loginDialog = null;
    });
  }
  
  register() {
    this.registerDialog = this.dialog.open(RegisterDialog, this.config);
    this.registerDialog.afterClosed().subscribe(result => {
      if(result) {
        console.log(result);
        this.actionservice.action('register', {username: result.username, mail: result.mail, password: result.password});
      }
      this.loginDialog = null;
    });
  }
  
  /*
  loginObserv() {
    Observable.timer(0, 10000).switchMap(
        () => {
            this.actionservice.action('login' ,'');
        }
    );
  }*/

  constructor(
    public dialog:          MdDialog,
    public store:           Store<any>,
    public actionservice:   ActionService
  ) {
    if(! localStorage['token']) {
        this.login();    
    }
  }

    ngOnInit() {
        this.store.select('cache').subscribe((res: any) => this.cache = res.cache);
    }

    setSphere(sphere) {
        console.log(sphere);
        this.actionservice.action('set_sphere', sphere);
    }

}

@Component({
  selector: 'add-sphere-dialog',
  template: `
    <md-input-container>
        <input #name md-input placeholder="Sphère">
    </md-input-container>
  <button md-button (click)="dialogRef.close(name.value)">Ajouter</button>`
})
export class AddSphereDialog {
  constructor(public dialogRef: MdDialogRef<AddSphereDialog>) { }
}

@Component({
  selector: 'login-dialog',
  template: `
    <md-input-container>
        <input #name md-input placeholder="Sphère">
    </md-input-container>
  <button md-button (click)="dialogRef.close(name.value)">Ajouter</button>
  <button md-button (click)="dialogRef.close('register')">S'enregistrer</button>`
})
export class LoginDialog {
  constructor(public dialogRef: MdDialogRef<LoginDialog>) { }
}

@Component({
  selector: 'register-dialog',
  template: `
    <md-input-container>
        <input #name     md-input placeholder="UserName">
    </md-input-container>
    <md-input-container>
        <input #mail     md-input placeholder="E-Mail">
    </md-input-container>
    <md-input-container>
        <input #password md-input placeholder="Password">
    </md-input-container>
  <button md-button (click)="dialogRef.close({username: name.value, mail: mail.value, password: password.value})">Ajouter</button>`
})
export class RegisterDialog {
  constructor(public dialogRef: MdDialogRef<RegisterDialog>) { }
}
