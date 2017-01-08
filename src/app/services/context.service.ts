import { Store }           from '@ngrx/store';

import { Injectable }      from '@angular/core';

@Injectable()
export class ContextService {

  whereIs = {
        project_id: {from: 'tenants', how: 'find',  select: 'id', where: 'activated', equal: true},
        zone_id:   {from: 'zones',   how: 'first', select: 'id'},
        zone_name: {from: 'zones',   how: 'first', select: 'name'},
        router_id: {from: 'routers', how: 'first', select: 'id'}
  };

  constructor(
    private store:  Store<any>
  ) {}

  returnField(field: string) {
    console.log('ContextService - returnField');
    if((<any>this.whereIs)[field]) {
      let descField = (<any>this.whereIs)[field];
      let resultValue: string;
      this.store.select(descField.from).subscribe(
          (ok: any) => {
            switch(descField.how) {
              case 'find':
                resultValue = ok.find((e: any) => e[descField.where] === descField.equal)[descField.select];
                break;
              case 'first':
                resultValue = ok[0][descField.select];
                break;
              default:
                resultValue = '';
                break;
            }
          }
      );
      console.log(resultValue);
      return resultValue;
    }else {
      console.log('Error: ContextService - returnField');
      console.log(field + ' not found in whereIs');
      return '';
    }
  }
}

