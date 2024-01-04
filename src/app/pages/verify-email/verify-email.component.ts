import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AppComponent } from '../../app.component';
import { AuthenticationService } from '../../services/authentication.service';
import { SnackbarService } from '../../utils/snackbar.service';
import { ReloadComponent } from '../reload/reload.component';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule,
    RouterModule
  ]
})
export class VerifyEmailComponent extends ReloadComponent implements OnInit {

  constructor(public authService: AuthenticationService, private route: ActivatedRoute,
    private snackBar: SnackbarService, public override router:Router) { 
      super(router);
    this.snackBar.loading = true;
  }

  ngOnInit() {
    this.authService.logout();
    
    this.authService.verifyEmail(this.route.snapshot.params['token']).subscribe(value => {
      this.snackBar.loading = false;
      if(value) {
        this.router.navigate(['/login']);
        this.snackBar.success("Success", "Your email was confirmed!");
      }
      else {
        this.router.navigate(['/login']);
        this.snackBar.error("Sorry", "Your email was not confirmed!");
      }
    })
  }

}
