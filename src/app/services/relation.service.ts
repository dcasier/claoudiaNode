import { SphereRelation }  from './relation.service/sphere.relation';
import { Store }           from '@ngrx/store';
import { Observable }      from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/concatAll';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';

import { ApiRest }            from './apirest';

import { Injectable }      from '@angular/core';

@Injectable()
export class RelationService {

  selectedProject: any;
  relations: any = [];

  constructor(
        public  apirest: ApiRest,
        public  store: Store<any>,
        private sphererelation: SphereRelation
  ) {
    this.getRelations(sphererelation);
  }


  /*
  * Dictionnaire de toutes les relations possible (doivent être uniques)
  * La valeur correspond à l'exécutant de lrelation'
  */
  private getRelations(openstackrelation: any) {
    for(let cmdName of openstackrelation.listRelations) {
      this.relations[cmdName] = openstackrelation;
    }
  }
}

