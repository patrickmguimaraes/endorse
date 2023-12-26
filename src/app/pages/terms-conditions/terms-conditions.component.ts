import { Component, OnInit } from '@angular/core';
import { ReloadComponent } from '../reload/reload.component';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { AgreementService } from '../../services/agreement.service';
import { Agreement } from '../../models/agreement.model';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule,
  ]
})
export class TermsConditionsComponent extends ReloadComponent implements OnInit {
  termAndCondition: Agreement;

  constructor(public override router:Router, private termAndConditionService: AgreementService) { 
    super(router);
    //this.loadScripts();
  }

  ngOnInit() {
    this.termAndConditionService.getAll().subscribe(terms => {
      terms.forEach(term => {
        if(term.type=="Terms and Conditions") {
          this.termAndCondition = term;
        }
      })
    })
  }
}
