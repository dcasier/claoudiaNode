import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class UploadService {

  progressObserver: any;

  progress = Observable.create(observer => {
    this.progressObserver = observer;
  }).share();

  constructor () {
  }

  makeFileRequest (url: string, headers: any, files: File[]): Observable<any> {
    return Observable.create(observer => {
        let formData: FormData = new FormData(),
            xhr: XMLHttpRequest = new XMLHttpRequest();

        for(let file of files) {
	    console.log(file);
            formData.append("uploads[]", file, file.name);
        }

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    //observer.next(JSON.parse(xhr.response));
                    observer.next(xhr.response);
                    observer.complete();
                } else {
                    observer.error(xhr.response);
                }
            }
        };

        //xhr.upload.onprogress = (event) => {
        //    this.progress = Math.round(event.loaded / event.total * 100);
        //    this.progressObserver.next(this.progress);
        //};

        xhr.open('POST', url, true);
        xhr.setRequestHeader( 'accesskey', localStorage.getItem('accesskey') );
        xhr.setRequestHeader( 'secretkey', localStorage.getItem('secretkey') );
        //for(let key of headers.headers.keys()){
        //    let value = headers.headers.get(key);
        //    xhr.setRequestHeader(key, value);        
        //}
        xhr.send(formData);
    });
  }
}
