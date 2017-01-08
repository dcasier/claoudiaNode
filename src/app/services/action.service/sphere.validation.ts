import { Injectable }      from '@angular/core';

@Injectable()
export class SphereValidation {

  listValidations: any = [ ];

  confirmContext(context: any, confirm: any) {
    if(! context.confirmed) {
          return <any>Object.assign(
                context, confirm);}
    return context;
  }

  validation(cmd: string, context: any) {
    switch(cmd) {
      default:
        context['confirmed'] = true;
        return context;
    }
  }
}
