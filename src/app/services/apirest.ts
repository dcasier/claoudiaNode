import { Headers,
         ResponseContentType,
         Http }		 from '@angular/http';

import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/share';
//import 'rxjs/add/operator/switchMap';
//import 'rxjs/add/operator/distinctUntilChanged';

import { JsonService }      from './json.service';
import { UploadService }    from './upload.service';

//import { HttpInterceptorService } from 'ng2-http-interceptor';

import { Injectable }       from '@angular/core';
@Injectable()
export class ApiRest {

  projectID: string;

  constructor(
    private http:          Http,
    private jsonservice:   JsonService,
	private uploadservice: UploadService, 
  ) {
  }

  setProjectID(id: string) {
    this.projectID = id;
  }

  getHttp(url: string) {
    console.log('apiRest - postHeaders');
    console.log(this.getHeaders());
    return this.http.get(url, this.getHeaders()).share();
  }

  putHttp(url: string, form: string) {
    let body = Object.assign({}, this.postHeaders(), {body: form});
    console.log(form);
    return this.http.put(url, form, body).share();
  }

  postHttp(url: string, form: string) {
    let body = Object.assign({}, this.postHeaders(), {body: form});
    console.log(form);
    return this.http.post(url, form, body).share();
  }

  deleteHttp(url: string) {
    return this.http.delete(url, this.getHeaders()).share();
  }

  postHeaders() {
    let _token     = sessionStorage.getItem('auth_token');
    let headers    = new Headers();
    let headersMap = {
        'Access-Control-Allow-Origin': 'https://localhost:8443',
        'X-Auth-Token':                 _token,
        'Content-Type':                'application/json',
        'Accept':                      'application/json',
        'responseType':                 ResponseContentType.Blob        
    };
    for(let key of Object.keys(headersMap)) {
        headers.append(key, headersMap[key]);
    }
    if(localStorage.getItem('accesskey')) {
        headers.append( 'accesskey', localStorage.getItem('accesskey') );
        headers.append( 'secretkey', localStorage.getItem('secretkey') );
    }
    return {headers: headers};
  }

  getHeaders() {
    return Object.assign({}, this.postHeaders(), {body: ''});
  }

  send(cmd: string, context: any) {
    console.log('Api Rest - send');
    console.log(cmd);
    console.log(context);
    context = this.jsonservice.getHttpUrlBody(cmd, context);
    console.log(context);
    switch(context.http) {
      case 'GET':
        return this.getHttp(context.url);
      case 'POST':
        return this.postHttp(context.url, context.body);
      case 'PUT':
        return this.putHttp(context.url, context.body);
      case 'DELETE':
        return this.deleteHttp(context.url);
      case 'HEAD':
        console.log('Not supported');
        break;
      case 'UPLOAD':
	    return this.uploadservice.makeFileRequest(context.url, this.postHeaders(), context.body);
      case 'DOWNLOAD':
        return this.uploadservice.getMediaRequest(context.url, this.postHeaders());
        //return this.getHttp(context.url);
      default:
        console.log('ApiRest - send');
        console.log('Not supported');
        break;
    }
    return this.postHttp(context.url, context.body);
  }

  setContext(keyVar: string, value: string) {
    console.log('ApiRest - setContext');
    console.log(this.jsonservice.context);
    (<any>this.jsonservice.context)[keyVar] = value;
  }

  getServiceDescription(service: string) {
    return this.getHttp('description/' + service + '.json');
  /*  return Observable.timer(0,300000)
      .switchMap(() => this.getHttp('description/' + service + '.json'))
      .distinctUntilChanged();*/
  }

  getObservable(service: string) {
    return this.getHttp(this.jsonservice.getHttpUrlBody(service, {}).url);
  }
}
