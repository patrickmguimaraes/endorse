import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { Category } from '../../models/category.model';
import { Company } from '../../models/company.model';
import { Person } from '../../models/person.model';
import { User } from '../../models/user.model';
import { AuthenticationService } from '../../services/authentication.service';
import { CategoryService, CompanyService } from '../../services/company.service';
import { AgreementService } from '../../services/agreement.service';
import { UserService } from '../../services/user.service';
import { Converter } from '../../utils/converter';
import { SnackbarService } from '../../utils/snackbar.service';
import { ReloadComponent } from '../reload/reload.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ToastrModule } from 'ngx-toastr';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Agreement } from '../../models/agreement.model';
import { UserAgreement } from '../../models/user-agreement.model';
import { UserSettings } from '../../models/user-settings.model';

declare var $: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatButtonModule,
    MatExpansionModule,
    RouterModule
  ]
})
export class SignupComponent extends ReloadComponent implements OnInit {
  year: number = new Date().getFullYear();
  public formSignup: FormGroup;
  user: User = new User();
  business: boolean = false;
  provider: string;
  providerId: string;
  email: string;
  @ViewChild('buttonBack', { static: true }) buttonBack: ElementRef;
  categories: Array<Category> = [];
  termAndCondition: Agreement = new Agreement();
  privacyPolicy: Agreement = new Agreement();
  showPassword: boolean = false;
  public mensagem: String = "";
  public mensagemErro: String = "";

  constructor(
    private app: SnackbarService,
    private authService: AuthenticationService,
    public override router:Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private http: HttpClient,
    private termAndConditionService: AgreementService,
    private _adapter: DateAdapter<Date>
  ) {
    super(router);
    this.loadScripts();
    this.setInitialValues();

    this._adapter.setLocale(this.authService.getSessao().language + "-" + this.authService.getSessao().country);
  }

  ngOnInit() {
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories;
    })

    this.termAndConditionService.getAll().subscribe(terms => {
      terms.forEach(term => {
        if(term.type=="Terms and Conditions") {
          this.termAndCondition = term;
        }
        else if(term.type=="Privacy Policy") {
          this.privacyPolicy = term;
        }
      })
    })

    this.setInitialValues();
  }

  setInitialValues() {
    this.email = this.route.snapshot.params['email'];
    this.provider = this.route.snapshot.params['provider'];
    this.providerId = this.route.snapshot.params['providerId'];

    if (this.email) {
      this.user.email = this.email;
      var combine = { ...this.user, ...this.user.person, ...this.user.company, ...{ confirmPassword: '', acceptTerms: false, emailNotification: false, newsletter: false, birth: '' } }
      this.formSignup = this.formBuilder.group(combine);
      this.formSignup.get('email')?.disable();
    }
    else {
      var combine = { ...this.user, ...this.user.person, ...this.user.company, ...{ confirmPassword: '', acceptTerms: false, emailNotification: false, newsletter: false, birth: '' } }
      this.formSignup = this.formBuilder.group(combine);
    }
  }

  signUp() {
    try {
      this.app.loading = true;

      if (this.formSignup.value.acceptTerms) {
        var user: User = Converter.cloneFromForm(this.formSignup.value, new User());

        if (this.formSignup.value.type == 'Company') {
          var c = new Company();
          c.categoryId = this.formSignup.value.categoryId;
          c.businessLocation = this.formSignup.value.businessLocation;
          c.businessSize = this.formSignup.value.businessSize;
          c.businessWebsite = this.formSignup.value.businessWebsite;
          c.name = this.formSignup.value.name;

          this.categories.forEach(cat => {
            if (cat.id == this.formSignup.value.categoryId) {
              c.category = cat;
            }
          })

          user.company = c;
          user.person = undefined;

          this.finishSignUp(user);
        }
        else {
          var p = new Person();
          p.birth = this.formSignup.value.birth;
          p.gender = this.formSignup.value.gender;
          p.name = this.formSignup.value.name;
          p.profession = this.formSignup.value.profession;
          p.surname = this.formSignup.value.surname;

          user.person = p;
          user.company = undefined;

          this.finishSignUp(user);
        }
      }
    } catch (error) {
      this.app.loading = false;
    }
  }

  finishSignUp(user: User) {
    try {
      user.role = "user";
      user.language = this.authService.getSessao().language + "-" + this.authService.getSessao().country;
      user.location = this.authService.getSessao().country;
      user.username = user.email;
      user.isEmailVerified = false;
      if(!user.streetLine2 || user.streetLine2.length==0) { user.streetLine2 = ""; }

      var term: UserAgreement = new UserAgreement();
      term.agreement = this.termAndCondition;
      term.agreementId = this.termAndCondition.id;
      term.date = new Date();

      var termPolicy: UserAgreement = new UserAgreement();
      termPolicy.agreement = this.privacyPolicy;
      termPolicy.agreementId = this.privacyPolicy.id;
      termPolicy.date = new Date();
      
      user.userAgreements = [term, termPolicy];

      user.settings = new UserSettings();
      user.settings.newsletter = this.formSignup.value.newsletter;
      user.settings.emailNotifications = this.formSignup.value.emailNotification;

      this.authService.register(user).subscribe(value => {
        this.app.loading = false;

        if (value) {
          this.setTempProfilePicture(value.id);
        }
      });
    } catch (error) {
      this.app.loading = false;
    }
  }

  setTempProfilePicture(id: number) {
    this.http.get('./../../../assets/images/profile.png', { responseType: 'blob' })
      .subscribe(res => {
        const formData = new FormData();
        const file = new File([res], "profile.png")
        formData.append('sampleFile', file);

        this.userService.attachProfilePicture(formData, id).subscribe(value => {
          this.app.success("User", "User created! Now, check your email to validate!")
          this.router.navigate(['/login']);
        })
      });
  }

  changeType() {
    this.business = !this.business;
  }

  emailExits() {
    this.userService.existsEmail(this.formSignup.value.email).subscribe(result => {
      if (result) {
        this.app.error("Error", "This email is already registered!");
        (this.buttonBack.nativeElement as HTMLAnchorElement).click();
      }
    })
  }

  step1Verify() {
    if (this.mensagemErro != "This email is already registered!") {
      this.limparErros();
    }
    
    if (this.formSignup.value.email == "" || (this.formSignup.value.email && (this.formSignup.value.email as string).search("@") < 0)) { return true; }
    if (this.formSignup.value.password == "") { return true; }

    if ((this.formSignup.value.password as string).length < 8) {
      this.mensagemErro = "Your password needs a minimum of 8 characters!";
      return true;
    }

    if ((this.formSignup.value.password as string).search(/[a-z]/) < 0) {
      this.mensagemErro = "Your password needs a lowercase letter!";
      return true;
    }

    if ((this.formSignup.value.password as string).search(/[A-Z]/) < 0) {
      this.mensagemErro = "Your password needs an uppercase letter!";
      return true;
    }

    if ((this.formSignup.value.password as string).search(/[0-9]/) < 0) {
      this.mensagemErro = "Your password needs a number!";
      return true;
    }

    if (this.formSignup.value.confirmPassword == "") { return true; }

    if (this.formSignup.value.password != "" && this.formSignup.value.confirmPassword != "" && this.formSignup.value.password != this.formSignup.value.confirmPassword) {
      this.mensagemErro = "The passwords are not equal!";
      return true;
    }

    return false;
  }

  step2Verify() {
    if (this.formSignup.value.type != 'Company') {
      if (this.formSignup.value.name == "") { return true; }
      if (this.formSignup.value.surname == "") { return true; }
      if (this.formSignup.value.gender == "") { return true; }
      if (this.formSignup.value.profession == "") { return true; }
      if (!this.formSignup.value.birth || this.formSignup.value.birth == "") { return true; }
    }
    else {
      if (this.formSignup.value.name == "") { return true; }
      if (this.formSignup.value.businessIndustry == "") { return true; }
      if (this.formSignup.value.businessLocation == "") { return true; }
      if (this.formSignup.value.businessSize == "") { return true; }
    }

    return false;
  }

  step3Verify() {
    if (this.formSignup.value.streetLine1 == "") { return true; }
    if (this.formSignup.value.country == "") { return true; }
    if (this.formSignup.value.state == "") { return true; }
    if (this.formSignup.value.city == "") { return true; }
    if (this.formSignup.value.postalCode == "") { return true; }

    return false;
  }

  step4Verify() {
    if (this.formSignup.value.acceptTerms == false) { return true; }

    return false;
  }

  loadScripts() {
    const dynamicScripts = [
      "assets/js/jquery.min.js",
      "assets/js/imagesloaded.pkgd.min.js",
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

  limparErros() {
    this.mensagem = "";
    this.mensagemErro = "";
  }
}
