import { Component,
         ChangeDetectorRef } from '@angular/core';
import { Store }             from '@ngrx/store';
import { ActionService }     from '../../services/action.service';

@Component({
    selector: 'event-add',
    templateUrl: 'eventadd.component.html',
    styleUrls: ['eventadd.component.css'],
    inputs:['activeColor','baseColor','overlayColor']
})
export class EventAddComponent {
    
    iconColor: string;
    borderColor: string;
    activeColor: string = 'green';
    baseColor: string = '#ccc';
    overlayColor: string = 'rgba(0,0,0,0.5)';
    
    dragging: boolean = false;
    loaded: boolean = false;
    imageLoaded: boolean = false;
    imageSrc: string = '';

    // The next two lines are just to show the resize debug
    // they can be removed
    //[name, original, thumbnail]
    public file_srcs: string[][][] = [];

    // This is called when the user selects new files from the upload button
    fileChange(input){
        this.readFiles(input.files);
    }

  readFile(file, reader, callback){
    // Set a callback funtion to fire after the file is fully loaded
    reader.onload = () => {
      console.log(reader);
      // callback with the results
      callback(reader.result, file.name);
    }

    // Read the file
    reader.readAsDataURL(file);
  }

  readFiles(files, index=0){
    // Create the file reader
    let reader = new FileReader();

    //if index in files
    if(index in files) {
      this.readFile(files[index], reader, (result, name) => {
        var img = document.createElement("img");
        img.src = result;

        this.resize(name, img, 400, 400, (resized_jpeg) => {

          // This is also the file you want to upload. (either as a
          // base64 string or img.src = resized_jpeg if you prefer a file). 
          this.file_srcs.push([name, img.src, resized_jpeg]);
          this.readFiles(files, index+1);
        });
      });
    }else{
      this.changeDetectorRef.detectChanges();
    }
  }

  resize(name, img, MAX_WIDTH:number, MAX_HEIGHT:number, callback){
    // This will wait until the img is loaded before calling this function
    return img.onload = () => {
      console.log("img loaded");
      // Get the images current width and height
      var width = img.width;
      var height = img.height;

      if (width > height) {
          if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
          }
      } else {
          if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
          }
      }

      var canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      var ctx = canvas.getContext("2d");  
      ctx.drawImage(img, 0, 0,  width, height); 

      // Get this encoded as a jpeg
      // IMPORTANT: 'jpeg' NOT 'jpg'
      var dataUrl = canvas.toDataURL('image/jpeg');

      callback(dataUrl);
    };
  }

  constructor(
    public store:           	Store<any>,
    public actionservice:	ActionService,
    private changeDetectorRef: ChangeDetectorRef
    ) {
  }

    handleDragEnter() {
        this.dragging = true;
    }
    
    handleDragLeave() {
        this.dragging = false;
    }
    
    handleDrop(e) {
        e.preventDefault();
        this.dragging = false;
        console.log(e);
        this.readFiles(e.target.control.files);
    }
    
    handleImageLoad() {
        this.imageLoaded = true;
        this.iconColor = this.overlayColor;
    }

    handleInputChange(e) {
        console.log(e);
        this.readFiles(e.target.files);
    }

    base64ToFile(name, b64) {
        console.log(- 'base64ToFile');
        let img  = b64.split(',')[1];
        let blob = new Blob([img],  {type: 'image/jpeg'});
        let file = new File([blob], name,  {type: blob.type});
        return file;
    }

    sendAll() {
	let allFiles: File[] = [];
        for(let img of this.file_srcs){
            allFiles.push(this.base64ToFile(img[0], img[1]));
            allFiles.push(this.base64ToFile('Thumbnail'+img[0], img[2]));
        }
        this.actionservice.action('add_medias', {body: allFiles});
        this.file_srcs = [];
        this.actionservice.action('reload', '');
    }

    _setActive() {
        this.borderColor = this.activeColor;
        if (this.imageSrc.length === 0) {
            this.iconColor = this.activeColor;
        }
    }
    
    _setInactive() {
        this.borderColor = this.baseColor;
        if (this.imageSrc.length === 0) {
            this.iconColor = this.baseColor;
        }
    }
    
}
