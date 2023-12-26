import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { AgreementService } from '../../services/agreement.service';
import { Agreement } from '../../models/agreement.model';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule,
  ],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {
  privacyPolicy: Agreement;
  
  constructor(private termAndConditionService: AgreementService) { 
    
  }

  ngOnInit() {
    this.termAndConditionService.getAll().subscribe(terms => {
      terms.forEach(term => {
        if(term.type=="Privacy Policy") {
          this.privacyPolicy = term;
        }
      })
    })
  }
}
