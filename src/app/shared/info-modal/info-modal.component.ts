import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html'
})
export class InfoModalComponent implements OnInit {
  @Input() title;
  @Input() message;

  constructor(public activeModal: NgbActiveModal) {}
  ngOnInit() {
    console.log('TITLE: ', this.title);
    console.log('MESSAGE: ', this.message);
  }

}
