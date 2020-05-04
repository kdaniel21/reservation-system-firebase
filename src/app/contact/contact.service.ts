import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({providedIn: 'root'})
export class ContactService {
  constructor(private afStore: AngularFirestore) {}

  sendContactForm(contactForm: FormGroup) {
    const controls = contactForm.controls;

    return this.afStore.collection('messages').add({
      name: controls.name.value,
      email: controls.email.value,
      type: controls.type.value,
      message: controls.message.value,
      priority: controls.type.value === 'Option2'
    });
  }
}
