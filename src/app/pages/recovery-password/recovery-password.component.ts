import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReloadComponent } from '../reload/reload.component';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.scss'],
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
export class RecoveryPasswordComponent extends ReloadComponent implements OnInit  {
  form: FormGroup = this.formBuilder.group({email: ''});
  formConfirmed: FormGroup = this.formBuilder.group({email: '', password: ''});
  emailValidated: boolean;
  year: number = new Date().getFullYear();
  showPassword: boolean = false;
  
  constructor(public override router:Router, private route: ActivatedRoute, private formBuilder: FormBuilder) {
    super(router);
    this.loadScripts()
  }

  ngOnInit() {
    this.emailValidated = this.route.snapshot.params['email']!=null;

    if(this.emailValidated) {
     this.formConfirmed = this.formBuilder.group({email: this.route.snapshot.params['email'], password: ''});
    }
  }

  loadScripts() {
    const dynamicScripts = [
      "assets/js/jquery.min.js",
      "assets/js/bootstrap.min.js",
      "assets/js/imagesloaded.pkgd.min.js",
      "assets/js/validator.min.js",
      "assets/js/jquery.mb.YTPlayer.min.js",
      "assets/js/main.js"];

    for (let i = document.getElementsByTagName('script').length - 1; i >= 0; i--) {
      dynamicScripts.forEach(path => {
        if ((window.location.origin + "/" + path) == document.getElementsByTagName('script')[i].src) {
          document.getElementsByTagName('head')[0].removeChild(document.getElementsByTagName('script')[i]);
        }
      })
    }

    for (let i = 0; i < dynamicScripts.length; i++) {
      const node = document.createElement('script');
      node.src = dynamicScripts[i];
      node.type = 'text/javascript';
      node.async = false;
      document.getElementsByTagName('head')[0].appendChild(node);
    }
  }

  showHidePassword() {
    this.showPassword = !this.showPassword;
  }

  sendConfirmation() {
    
  }
}
