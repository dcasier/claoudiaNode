import { Component,
         ViewChild }        from '@angular/core';

import { AppState }         from '../app.service';
import { Store }            from '@ngrx/store';

import { ActionService }    from '../services/action.service';

import { MdDialog,
         MdDialogRef,
         MdDialogConfig,
         TooltipPosition }  from '@angular/material';

@Component({
  selector: 'home',  // <home></home>
  styleUrls: [ './home.component.css' ],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  dialogRef: MdDialogRef<AddEventDialog>;
  lastCloseResult: string;
  config: MdDialogConfig = {
    disableClose: false,
  };

  abos: any = [
    {name: 'Abo1'}, {name: 'Abo2'}, {name: 'Abo3'}, {name: 'Abocal'}]

  position: TooltipPosition = 'below';
  message: string;

  devices = [];
  localDevice = {
            infos: {},
            image: 'http://www.promo-conso.net/produits/acer/e5-523g-937f_small.jpg'
        };

  messages: any[] = [
    {
      from: 'Nancy',
      subject: 'Brunch?',
      message: 'Did you want to go on Sunday?',
      image: 'https://angular.io/resources/images/bios/julie-ralph.jpg'
    },
    {
      from: 'Mary',
      subject: 'Summer BBQ',
      message: 'Wish I could come, ',
      image: 'https://angular.io/resources/images/bios/juleskremer.jpg'
    }
  ];

  basicRowHeight = 80;
  fixedCols = 4;
  fixedRowHeight = 100;
  ratioGutter = 1;
  fitListHeight = '400px';
  ratio = '4:1';

  // Set our default values
  localState = { value: '' };
  // TypeScript public modifiers

  constructor(
    public dialog:   MdDialog,
    public store:    Store<any>,
    public appState: AppState, 
    public actionservice:    ActionService) {
    actionservice.action('get_device', '').subscribe(device => {
        this.localDevice.infos = device;
        if(device.disk) {
            this.message = device.disk.free + ' Go libres sur ' + device.disk.size + ' Go (' + device.disk.name + ')';
        }
    });
  }
  
  open() {
    this.dialogRef = this.dialog.open(AddEventDialog, this.config);

    this.dialogRef.afterClosed().subscribe(result => {
      this.lastCloseResult = result;
      this.dialogRef = null;
    });
  }

  addEvent() {
    this.dialogRef = this.dialog.open(AddEventDialog, this.config);
    this.dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.actionservice.action('add_event', result);
      }
      this.dialogRef = null;
    });
  }
  
  setEvent(event: string) {
      this.actionservice.action('set_event', event);
  }
}

@Component({
  selector: 'demo-add-event-dialog',
  template: `
    <md-input-container>
        <input #name md-input placeholder="Evénement">
    </md-input-container>
  <button md-button (click)="dialogRef.close(name.value)">Ajouter</button>
  <tr> (calendrier)`
})
export class AddEventDialog {
  constructor(public dialogRef: MdDialogRef<AddEventDialog>) { }
}
