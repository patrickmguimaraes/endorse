import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { AuthenticationService } from '../../services/authentication.service';
import { SnackbarService } from '../../utils/snackbar.service';
import { ReloadComponent } from '../reload/reload.component';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
export class LoginComponent extends ReloadComponent implements OnInit {
  public formLogin: FormGroup;
  public mensagem: String = "";
  public mensagemErro: String = "";
  year: number = new Date().getFullYear();
  showPassword: boolean = false;

  constructor(
    public authService: AuthenticationService,
    public override router:Router,
    private formBuilder: FormBuilder,
    private app: SnackbarService) {
      super(router);
      
    this.formLogin = this.formBuilder.group({ email: "", password: "" });

    this.loadScripts();
  }

  ngOnInit() {
    
  }

  login() {
    this.limparErros();

    if (this.formLogin.value.email != "" && this.formLogin.value.password != "") {
      var user = this.formLogin.value;
      user.email = user.email.toLowerCase().replace(" ", "");
  
      this.app.loading = true;

      this.authService.login(user.email, user.password).subscribe((user): any => {
        this.app.loading = false;

        if (user.isEmailVerified) {
          this.formLogin = this.formBuilder.group({ email: "", password: "" });
          this.router.navigate(["/"]);
        } else {
          this.app.error('Error', 'Email is not verified. Please, check you email!');
        }
      }, (error) => {
        this.app.loading = false;

        if ((error.message as string).includes("The supplied auth credential is incorrect, malformed or has expired. (auth/invalid-credential)")) {
          this.app.error('Error', "Sorry, we cound't find any account registered.");
        }
      })
    }
    else {
      this.app.error('Error', "Please, all filds are required!");
    }
  }

  googleAuth() {
    this.limparErros();

    // this.authService.googleAuth().then(result => {
    //   if (result == true) {
    //     //this.mensagem = "You did the login!";
    //   }
    //   else {
    //     this.mensagemErro = result as string;
    //   }
    // })
  }

  appleAuth() {
    this.limparErros();

    // this.authService.appleAuth().then(result => {
    //   if (result == true) {
    //     //this.mensagem = "You did the login!";
    //   }
    //   else {
    //     this.mensagemErro = result as string;
    //   }
    // })
  }

  facebookAuth() {
    this.limparErros();

    // this.authService.facebookAuth().then(result => {
    //   if (result == true) {
    //     //this.mensagem = "You did the login!";
    //   }
    //   else {
    //     this.mensagemErro = result as string;
    //   }
    // })
  }

  limparErros() {
    this.mensagem = "";
    this.mensagemErro = "";
  }

  loadScripts() {
    const dynamicScripts = [
      "assets/js/jquery.min.js",
      "assets/js/imagesloaded.pkgd.min.js",
      "assets/js/jquery.mb.YTPlayer.min.js",
      "assets/js/main.js"];

    for (let i = document.getElementsByTagName('script').length-1; i >=0 ; i--) {
      dynamicScripts.forEach(path => {
        if((window.location.origin + "/" + path) == document.getElementsByTagName('script')[i].src) {
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
}