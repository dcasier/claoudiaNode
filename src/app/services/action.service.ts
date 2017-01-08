import { SphereAction }      from './action.service/sphere.action';
import { RelationService } from './relation.service';

import { ApiRest }            from './apirest';

import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/map';
import { Injectable }      from '@angular/core';

@Injectable()
export class ActionService {
    text = {'edit_sphere': [{tr: 'Supprimer', name: 'delete_sphere'}]};

    actions: any = {};
    validations: any = {};

    constructor(
        public apirest: ApiRest,
        public relationservice:  RelationService,
        private sphereaction: SphereAction
    ) {
        this.getActions(sphereaction);
    }

    valid(cmd: string, context: any) {
        if(this.validations[cmd]) {
            return this.validations[cmd].valid(cmd, context);
        }else {
            return <any>Object.assign(context, {confirmed: true});
        }
    }

    action(cmd: string, context: any) {
        //console.log(cmd);
        if(this.actions[cmd]) {
            //console.log('action exist');
            return this.actions[cmd].action(cmd, context);
        }else {
            if(context.context) {
            return context.context;
            }else {
                return context;
            }
        }
    }

    exec(cmd: string, context: any) {
        return this.actions[cmd].action(cmd, context);
    }

    /*
    * Dictionnaire de toutes les actions possible (doivent être uniques)
    * La valeur correspond à l'exécutant de l'action
    */
    private getActions(serviceaction: any) {
        for(let cmdName of serviceaction.listActions) {
            this.actions[cmdName] = serviceaction;
        }
        for(let cmdName of serviceaction.listValidations) {
            this.validations[cmdName] = serviceaction;
        }
    }
}

