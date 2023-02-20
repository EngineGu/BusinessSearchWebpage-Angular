//app.component.ts
import { Component, OnInit,Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AutocompleteService } from './services/autocomplete.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	closeResult = '';

  title = 'frontend';

  model: any ;

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
  ) { }

    ngOnInit() {
  }
}

