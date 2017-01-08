import { Component,
         ViewChild,
         Injectable,
         OnInit }           from '@angular/core';

import { Store }           	from '@ngrx/store';
import { ActionService }	from '../../services/action.service';

import { DomSanitizer } from '@angular/platform-browser';
//import { DomSanitizer } from '@angular/platform-browser';

import * as saveAs from 'file-saver';

import { Md5 }              from 'ts-md5/dist/md5';

@Component({
  selector: 'event',
  styleUrls: [ './event.component.css' ],
  templateUrl: './event.component.html'
})
export class EventComponent implements OnInit {

  dogs: Object[] = [
    { name: 'Porter', human: 'Kara' },
    { name: 'Mal', human: 'Jeremy' },
    { name: 'Koby', human: 'Igor' },
    { name: 'Razzle', human: 'Ward' },  
    { name: 'Molly', human: 'Rob' },
    { name: 'Husi', human: 'Matias' },
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

  medias = {};
      
  constructor(
    public store:           Store<any>,
    private sanitizer:      DomSanitizer,
    public actionservice:   ActionService
    ) {
  }
  
  ngOnInit() {
    this.store.select('medias').subscribe((medias: any) => {
        this.medias = medias;
        
        this.medias['base64'] = {};
        if(medias['keys']){
            for(let key of medias['keys']) {
                let name = medias.medias[key].name;
                console.log(medias.medias);
                this.actionservice.action('get_media', name).subscribe(res => {
                    //console.log(res);
                /*
                    //console.log(Md5.hashStr(res._body));
                    let body     = res._body;
                    let bodySize = body.length;
                    let uInt8Array = new Uint8Array(bodySize);
                    for(let i=bodySize; i--;) {
                        uInt8Array[i] = body[i].charCodeAt(0);
                    }
                    console.log(uInt8Array);
                    
                    let i = uInt8Array.length;
                    let binaryString = new Array(i);
                    while (i--)
                    {
                      binaryString[i] = String.fromCharCode(uInt8Array[i]);
                    }
                    let data = binaryString.join('');

                    let base64 = "data:image/jpeg;base64,"+window.btoa(data);
                    
                    console.log('base64');
                    
                    //console.log(base64);
                    this.medias['base64'][key] = base64;
                    */
                    
                    let blob = new Blob([res._body],{
                        type: res.headers.get("Content-Type")
                    });
                    //saveAs.saveAs(blob, name);
                    let img = document.createElement("img");
                    //img.src = ;
                    this.medias['base64'][key] = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(blob));
                    //window.open(this.medias['base64'][key]);
                    //this.trustedUrl            = this.sanitizer.bypassSecurityTrustResourceUrl(this.medias['base64'][key]);
                    /*
                    this.medias['base64'][key] = new FileReader();
                    this.medias['base64'][key].onloadend = (ok) => {
                    
                        let arrayBufferNew = ok.target.result;
                        let uint8ArrayNew  = new Uint8Array(arrayBufferNew);
                        console.log('ok');
                        console.log(uint8ArrayNew);
                        console.log(ok);
                        console.log(this);
                        console.log(ok.target.result);
                    };
                    this.medias['base64'][key].readAsDataURL(blob);
                    */
                });
            }
        }
        
    });
  }
  
  getUrl(media: string) {
    let lastsphere = this.actionservice.action('get_lastsphere', '');  
    let lastevent  = this.actionservice.action('get_lastevent', '');
    let url = 'https://localhost:8443/api/v0.1/'+lastsphere+'/'+lastevent+'/'+media;
    console.log(url);
    return url;
  }
}









