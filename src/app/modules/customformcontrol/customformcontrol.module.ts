import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ]
})
export class CustomformcontrolModule { 

  phoneNumber(c: AbstractControl) {
    const telephonePattern = /^[0-9\+\-\ ]{8,}$/;
    return c.value === '' || telephonePattern.test(c.value) ? null : { invalidTelephone: true };;
  }
  
  name(c: AbstractControl) {
    const namePattern = /^ *[A-Za-z]{2,} *( +[A-Za-z]{2,})* +[A-Za-z]{2,} *$/;
    return c.value === '' || namePattern.test(c.value) ? null : { invalidName: true };
  }
}