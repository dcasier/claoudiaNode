import { Injectable }      from '@angular/core';

@Injectable()
export class SphereRelation {

  listRelations = [  ];

  relation(cmd: string, context: any) {
    console.log('SphereRelation');
    switch(cmd) {
      default:
        //TODO : popup
        console.log('Erreur');
        break;
    }
  }
}
