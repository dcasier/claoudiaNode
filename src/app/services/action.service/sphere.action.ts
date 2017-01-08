import { SphereValidation } from './sphere.validation';

import { Injectable }       from '@angular/core';
import { ApiRest }          from '../apirest';
import { Store }            from '@ngrx/store';

@Injectable()
export class SphereAction {

  listActions = [
	'add_event',
   	'add_medias',
	'add_sphere',
	'delete_sphere',
    'get_device',
	'get_lastevent',
	'get_lastevents',
	'get_lastsphere',
	'get_lastspheres',
    'get_media',
	'load_cache',
	'load_event',
	'load_spheres',
    'login',
    'logout',
	'put_cache',
    'reload',
    'register',
	'set_event',
    'set_password',
	'set_sphere'
        ];

  listValidations: any;
  
  cache: any ;
  
  constructor(
    public spherevalidation: SphereValidation,
    public apirest: ApiRest,
    public store:   Store<any>
  ) {
    this.listValidations = spherevalidation.listValidations;
  }

  valid(cmd: string, context: any) {
    return this.spherevalidation.validation(cmd, context);
  }

  reload() {
    this.action('load_spheres', '');
    this.action('load_event', '');
  }
  
  removeFromArray(element: string, array: any) {
    let index = array.indexOf(element)
    if(index > -1) {
        array.splice(index, 1)    
    }
    return array
  }
  
  setLastOfArrayOrInit(element: string, array: any) {
    if(! array) {
        array = [];
    }
    array = this.removeFromArray(element, array);
    array.unshift(element);
    return array;
  }
  
  action(cmd: string, context: any) {
    //console.log('SphereAction - action');
    //console.log(cmd);
    //console.log(context);
    // !!! Penser à renseigner la liste d'Actions 
    let sphere: string;
    let event:  string;
    switch(cmd) {
      case 'add_event':
        sphere = this.action('get_lastsphere', '');
        this.apirest.send('add_event', {sphereName: sphere, eventName: context}).subscribe(ok => this.action('set_event', context));
        break;
      case 'add_medias':
        sphere = this.action('get_lastsphere', '');
        event  = this.action('get_lastevent', '');
        this.apirest.send('add_medias', {sphereName: sphere, eventName: event, body: context.body}).subscribe();
        break;
      case 'add_sphere':
        this.apirest.send('add_sphere', {sphereName: context}).subscribe(
            ok => this.action('set_sphere', context));
        break;
      case 'delete_sphere':
        this.apirest.send('delete_sphere', {sphereName: context}).subscribe();
        delete this.cache.cache.spheres[context];
        console.log(context);
        console.log(this.cache);
        this.cache.cache.lastspheres = this.removeFromArray(context, this.cache.cache.lastspheres);
        this.action('put_cache', this.cache);
        this.action('set_sphere', this.action('get_lastsphere', ''));
        break;
      case 'get_device':
        return this.apirest.send('get_device', '').map(res => res.json());
      case 'get_lastevent':
        let lastevents = this.action('get_lastevents', '');
        if(lastevents) { 
            return lastevents[0];
        }
        break;
      case 'get_lastevents':
        if(this.cache && this.cache.cache && this.cache.cache.spheres) {
            return this.cache.cache.spheres[this.action('get_lastsphere', '')];
        }
        break;
      case 'get_lastsphere':
        let lastspheres = this.action('get_lastspheres', '');
        if(lastspheres) {
            return lastspheres[0];
        }
        break;
      case 'get_lastspheres':
        if(this.cache && this.cache.cache) {
            return this.cache.cache.lastspheres;
        }
        break;
      case 'get_media':
        return this.apirest.send('get_media', {sphereName: this.action('get_lastsphere', ''),   eventName: this.action('get_lastevent', ''), mediaName: context});
      case 'load_cache':
        this.apirest.send('load_cache', '').subscribe(cache => {
            let payload = cache.json();
            console.log('cache : ');
            console.log(payload);
            if(! payload.cache.lastspheres) {
                payload.cache = { "lastspheres": [], "spheres": {} };}
            this.cache = payload;
            this.store.dispatch({type: 'LOAD_CACHE', payload: payload});
            this.reload();
        });
        break;
      case 'load_event':
        sphere = this.action('get_lastsphere', '');
        event  = this.action('get_lastevent', '');
        if(sphere && event) {
            this.apirest.send('load_event', {sphereName: sphere, eventName: event}).subscribe(
                medias => {
                    let payload = medias.json();
                    if(payload) {
                        this.store.dispatch({type: 'LOAD_MEDIAS', payload: payload});}
            });
        }
        break;
      case 'load_spheres':
        this.apirest.send('load_sphere', '').subscribe(sphere => {
            let payload = sphere.json();
            if(payload) {
                this.store.dispatch({type: 'LOAD_SPHERE', payload: payload});}
        });
        break;
      case 'put_cache':
        this.cache = context;
        this.apirest.send('put_cache', {body: context}).subscribe(
            ok => this.action('load_cache', '')
        );
        break;
      case 'reload':
        this.reload();
        break;
      case 'register':
        this.apirest.send('register', context).subscribe(ok => {
                let body = ok.json();
                localStorage.setItem('accesskey', body.accesskey);
                localStorage.setItem('secretkey', body.secretkey);
            });
        break;
      case 'set_event':
        if(this.cache && this.cache.cache) {
            let lastsphere = this.action('get_lastsphere', '');
            this.cache.cache.spheres[lastsphere] = this.setLastOfArrayOrInit(context, this.cache.cache.spheres[lastsphere])
            this.action('put_cache', this.cache);
        }
        break;
      case 'set_sphere':
        if(this.cache && this.cache.cache) {
            this.cache.cache.lastspheres = this.setLastOfArrayOrInit(context, this.cache.cache.lastspheres);
            console.log(this.cache);
            if(! this.cache.cache.spheres[context]) {
                this.cache.cache.spheres[context] = [];
            }
            this.action('put_cache', this.cache);
        }
        break;
      default:
        //TODO : popup
        console.log('Erreur');
        break;
    }
  }
}
