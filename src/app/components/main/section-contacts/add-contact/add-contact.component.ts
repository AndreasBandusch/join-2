import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Contact } from 'src/app/models/contact.model';
import { ControlService } from 'src/app/services/control.service';
import { CustomformcontrolModule } from 'src/app/modules/customformcontrol/customformcontrol.module';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})



export class AddContactComponent {
  inputName: string = '';
  inputEmail: string = '';
  inputPhone: string = '';


  constructor(
    public control: ControlService,
    private firestore: AngularFirestore,
    private fcontrol: CustomformcontrolModule) {
    this.createContactForm.valueChanges.subscribe(console.log)
  }

  public createContactForm: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      this.fcontrol.name
    ], []),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.minLength(10)
    ], []),
    phone: new FormControl('', [
      this.fcontrol.phoneNumber,
      Validators.minLength(10)
    ])
  });


  createContact() {
    // this.control.addContactDialogOpen = false;
    let newContact: Contact = new Contact(this.inputName, this.inputEmail, this.inputPhone);
    this.saveContact(newContact);
  }

  saveContact(newContact: any) {
    this.firestore
      .collection('contacts')
      .add(newContact.toJSON());
  }


  // Verhindert das Schließen des inneren Div-Containers beim Klicken
  public dontCloseByClick(event: Event) {
    event.stopPropagation();
  }

  checkErrors() {
    console.log('Errors :', this.createContactForm.controls['email'].errors);



  }

}


