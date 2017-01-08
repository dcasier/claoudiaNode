import { SphereAPI }      from './json.service/sphere.api';

import { ContextService }  from './context.service';

import { Injectable }      from '@angular/core';

@Injectable()
export class JsonService {

  context: any = {};

  actions: any = [];

  constructor(
        private contextservice: ContextService,
        private sphereapi: SphereAPI
  ) {
    console.log('JsonService - constructor');
    this.actions = Object.assign(
        this.getActions(sphereapi));
    console.log(this.actions);
  }

  /*
  * Pour gagner en lisibilité, les urls ne sont pas complètes dans les fichiers de description
  *
  */
  getActions(openstackapi: any) {
    let actions     = openstackapi.actions;
    let listActions = Object.keys(actions);

    for(let action of listActions){
      if(! actions[action].url_full) {
        actions[action].url = openstackapi.proxy + openstackapi.APIv + actions[action].url;
      }
    }
    return actions;
  }

  replaceVar(template: string, form: any) {
    console.log('JsonService - replaceVar');
    let newtemplate = template;
    for(let onlyForGetSize of newtemplate.split('{{')) {
      let start   = newtemplate.indexOf('{{') + 2;
      let end     = newtemplate.indexOf('}}');
      let field   = newtemplate.substr(start, (end - start));
      if(field !== '') {
        newtemplate = newtemplate.replace('{{' + field + '}}', this.getVar(field, form));
      }
      //Evite que le compilateur râle;
      onlyForGetSize = '';
    }
    return newtemplate;
  }

  getHttpUrlBody(action: string, form: any) {
    console.log('JsonService - getHttpUrlBody');
    console.log(action);
    console.log(form);
    let descAction = Object.assign({}, this.actions[action]);
    descAction.url = this.replaceVar(descAction.url, form);
    console.log(descAction);
    if(descAction.body) {
      descAction.body = this.replaceVar(descAction.body, form);
    }
    if(form.body) {
      descAction.body = form.body;
    }
    return descAction;
  }

  private getVar(name: string, form: any) {
  //console.log('JsonService - getVar');
    if(form[name]) {
      return form[name];
    }
    if((<any>this.context)[name]) {
      return (<any>this.context)[name];
    }else {
      return this.contextservice.returnField(name);
    }
  }
}

