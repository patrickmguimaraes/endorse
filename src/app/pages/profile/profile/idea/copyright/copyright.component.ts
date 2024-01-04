import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { environment } from '../../../../../../environments/environment';
import { ActivationDate } from '../../../../../models/activation-date.model';
import { Company } from '../../../../../models/company.model';
import { ComplianceMeasure } from '../../../../../models/compliance-measure.model';
import { ContentElement } from '../../../../../models/content-element.model';
import { Copyright } from '../../../../../models/copyright.model';
import { GeograficScope } from '../../../../../models/geografic-scope.model';
import { MediaChannel } from '../../../../../models/media-channel.model';
import { Metric } from '../../../../../models/metric.model';
import { RequestCopyrightActivationDate } from '../../../../../models/request-copyright-activation-date.model';
import { RequestCopyrightAssignment } from '../../../../../models/request-copyright-assignment.model';
import { RequestCopyrightComplianceMeasure } from '../../../../../models/request-copyright-compliance-measure.model';
import { RequestCopyrightContentElement } from '../../../../../models/request-copyright-content-element.model';
import { RequestCopyrightGeograficScope } from '../../../../../models/request-copyright-geografic-scope.model';
import { RequestCopyrightHistory } from '../../../../../models/request-copyright-history.model';
import { RequestCopyrightMediaChannel } from '../../../../../models/request-copyright-media-channel.model';
import { RequestCopyrightMetric } from '../../../../../models/request-copyright-metric.model';
import { User } from '../../../../../models/user.model';
import { ImagePipe } from '../../../../../pipes/image.pipe';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { CompanyService } from '../../../../../services/company.service';
import { OpenAIService } from '../../../../../services/openAI.service';
import { ActivationDateService, ComplianceMeasureService, ContentElementService, GeograficScopeService, MediaChannelService, MetricService, RequestService } from '../../../../../services/request.service';
import { UserService } from '../../../../../services/user.service';
import { SnackbarService } from '../../../../../utils/snackbar.service';
import { ReloadComponent } from '../../../../reload/reload.component';
import { RequestCopyright } from '../../../../../models/request-copyright.model';
import { File } from '../../../../../models/file.model';
import { Industry } from '../../../../../models/industry.model';
import { AddressService } from '../../../../../services/address.service';
import {MatAutocompleteModule, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../../components/confirm-dialog/confirm-dialog.component';
import { StorageService } from '../../../../../services/storage.service';
import { Post } from '../../../../../models/post';
import { PostService } from '../../../../../services/post.service';
import { Title } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-copyright',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule,
    ImagePipe, 
    DatePipe,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatButtonModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatTableModule
  ],
  templateUrl: './copyright.component.html',
  styleUrl: './copyright.component.scss'
})
export class CopyrightComponent extends ReloadComponent implements OnInit {
  form: FormGroup;
  user: User = new User();
  @ViewChild('editor') editor: ElementRef;
  request: RequestCopyright = new RequestCopyright();
  industries: Array<Industry> = [];
  companies: Array<Company> = [];
  copyrights: Array<Copyright> = [];
  mensagem: String = "";
  mensagemErro: String = "";
  mensagemErroData: String = "";
  mensagemErroActivationDate: String = "";
  mensagemErroAssigment: String = "";
  activationDates: Array<ActivationDate> = [];
  complianceMeasures: Array<ComplianceMeasure> = [];
  contentElements: Array<ContentElement> = [];
  geograficScopes: Array<GeograficScope> = [];
  mediaChannels: Array<MediaChannel> = [];
  metrics: Array<Metric> = [];
  requestActivationDates: Array<RequestCopyrightActivationDate> = [];
  requestAssignments: Array<RequestCopyrightAssignment> = [];
  requestFiles: Array<File> = []
  geograficScopesSelected: Array<GeograficScope> = [];
  panel: number = 1;
  progress: string = "0%"
  loadingAI: boolean = true;
  @ViewChild('accordion', {static:false}) accordion: MatAccordion;
  assignedPeople: Array<User> = [];
  imageSrc: any = "./../../../assets/images/add-picture.png";
  @ViewChild('reviewProposal') reviewProposal: ElementRef;
  company: Company;
  companyName: string;
  @ViewChild(MatAutocompleteTrigger, {read: MatAutocompleteTrigger}) companyInput: MatAutocompleteTrigger;
  copyright: Copyright;
  dateFormat: string;
  post: Post;
  displayedColumns: string[] = ['company', 'copyright', 'start', 'end', 'edit', 'delete'];
  displayedColumnsActivationDate : string[] = ['activation', 'date', 'delete'];

  alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel'
    },
    {
      text: 'Confirm',
      role: 'confirm'
    },
  ];

  constructor(private _adapter: DateAdapter<any>, private formBuilder: FormBuilder, private authService: AuthenticationService, private snackService: SnackbarService,
    private renderer: Renderer2, private categoryService: CompanyService, private companyService: CompanyService, private activationDateService: ActivationDateService,
    private complianceMeasureService: ComplianceMeasureService, private contentElementService: ContentElementService, private geograficScopeService: GeograficScopeService,
    private mediaChannelService: MediaChannelService, private metricService: MetricService, private requestService: RequestService, public override router:Router, private titleService: Title,
    private userService: UserService, private cdref: ChangeDetectorRef, public dialog: MatDialog, private fileService: StorageService, private route: ActivatedRoute, private postService: PostService) {
      super(router);
    //this.loadScripts();

    this._adapter.setLocale(this.authService.getSessao().language + "-" + this.authService.getSessao().country);
    this.dateFormat = this.authService.getSessao().dateFormat;
  }

  ngOnInit() {
    this.request = new RequestCopyright();

    this.form = this.formBuilder.group({ ...this.request, ... {activationDateId: 0, fileName: '', visibility: '', invitePersonId: 0, invitePersonEmail: '', invitePersonPermission: '', copyrightId: undefined, copyrightName: ''}, ...{ activationDateDate: new Date(new Date().getTime() + 86400000).toISOString().substring(0, 10) }, ...{ geograficScopes: [] }, ...{ mediaChannels: [] }, ...{ contentElements: [] }, ...{ complianceMeasures: [] }, ...{ metrics: [] } });
    this.form.get('invitePersonEmail')?.disable();
    this.form.get('description')?.disable();

    this.authService.getUser().subscribe(user => {
      if(user) {
        this.user = user;

        if(this.route.parent?.snapshot.params['postId']) {
          this.postService.getPost(this.user.id, this.route.parent?.snapshot.params['postId']).subscribe(value => {
            if(value && value.userId==this.user.id) {
              this.post = value;
              
              this.cdref.detectChanges();
              
              this.titleService.setTitle("Endorse an Idea - " + this.getName(this.post.user) + " - " + this.post.link + " - Legal and Copyright");

              this.categoryService.getAllIndustries().subscribe(industries => {
                this.industries = industries;
              })
          
              this.activationDateService.getAll().subscribe(activationDates => {
                this.activationDates = activationDates;
              })
          
              this.complianceMeasureService.getAll().subscribe(complianceMeasures => {
                this.complianceMeasures = complianceMeasures;
              })
          
              this.contentElementService.getAll().subscribe(contentElements => {
                this.contentElements = contentElements;
              })
          
              this.geograficScopeService.getAll().subscribe(geograficScopes => {
                this.geograficScopes = geograficScopes;
              })
          
              this.mediaChannelService.getAll().subscribe(mediaChannels => {
                this.mediaChannels = mediaChannels;
              })
          
              this.metricService.getAll().subscribe(metrics => {
                this.metrics = metrics;
              })
          
              this.progress = ((0 / 14) * 100) + "%";
            }
            else {
              this.router.navigate(["/page-not-found"]);
            }
          })
        }
        else {
          this.router.navigate(["/page-not-found"]);
        }
      }
    })
  }

  selectCopyright(request: RequestCopyright) {
    this.company = request.company;
    this.companies = [this.company];
    this.copyrights = this.company.copyrights;

    this.filterCopyrights();

    this.request = request;
    
    this.form = this.formBuilder.group({ ...this.request, ... {activationDateId: 0, fileName: '', visibility: '', invitePersonId: 0, invitePersonEmail: '', invitePersonPermission: '', copyrightId: undefined, copyrightName: ''}, ...{ activationDateDate: new Date(new Date().getTime() + 86400000).toISOString().substring(0, 10) }, ...{ geograficScopes: [] }, ...{ mediaChannels: [] }, ...{ contentElements: [] }, ...{ complianceMeasures: [] }, ...{ metrics: [] } });
    this.form.get('invitePersonEmail')?.disable();
    this.form.get('description')?.disable();
  }

  delete(request: RequestCopyright) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: "delete"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        // this.postService.deleteCollaboration(collaboration).subscribe(collaboration => {
        //   if(collaboration) {
        //     this.collaboration = new Collaboration();
        //     this.snack.success("Success", "You have just deleted the collaboration.");
        //     this.ngOnInit();
        //   }
        // })
      }
    });
  }

  requestRequest() {
    this.request = this.form.value;
    this.request.companyId = this.company.id;
    this.request.userId = this.user.id;
    this.request.postId = this.post.id;
    this.request.files = this.requestFiles;
    this.request.requestAssignments = this.requestAssignments;
    this.request.requestActivationDates = this.requestActivationDates;

    if(this.request.copyrightId!=0) {
      this.request.copyright = this.copyright;
    }
    else {
      this.request.copyright = new Copyright();
      this.request.copyright.company = this.company;
      this.request.copyright.companyId = this.company.id;
      this.request.copyright.text = this.request.description;
      this.request.copyright.name = this.form.value.copyrightName;
      this.request.copyright.visibleToAllPeople = false;
    }

    this.request.requestComplianceMeasures = [];
    (this.form.value.complianceMeasures as Array<ComplianceMeasure>).forEach(value => {
      var item: RequestCopyrightComplianceMeasure = new RequestCopyrightComplianceMeasure();
      item.complianceMeasure = value;
      item.complianceMeasureId = value.id;
      this.request.requestComplianceMeasures.push(item);
    })

    this.request.requestContentElements = [];
    (this.form.value.contentElements as Array<ContentElement>).forEach(value => {
      var item: RequestCopyrightContentElement = new RequestCopyrightContentElement();
      item.contentElement = value;
      item.contentElementsId = value.id;
      this.request.requestContentElements.push(item);
    })

    this.request.requestGeograficScopes = [];
    (this.form.value.geograficScopes as Array<GeograficScope>).forEach(value => {
      var item: RequestCopyrightGeograficScope = new RequestCopyrightGeograficScope();
      item.geograficScope = value;
      item.geograficScopeId = value.id;
      this.request.requestGeograficScopes.push(item);
    })

    this.request.requestMediasChannels = [];
    (this.form.value.mediaChannels as Array<MediaChannel>).forEach(value => {
      var item: RequestCopyrightMediaChannel = new RequestCopyrightMediaChannel();
      item.mediaChannel = value;
      item.mediaChannelId = value.id;
      this.request.requestMediasChannels.push(item);
    })

    this.request.requestMetrics = [];
    (this.form.value.metrics as Array<Metric>).forEach(value => {
      var item: RequestCopyrightMetric = new RequestCopyrightMetric();
      item.metric = value;
      item.metricId = value.id;
      this.request.requestMetrics.push(item);
    })

    var item: RequestCopyrightHistory = new RequestCopyrightHistory();
    item.date = new Date();
    item.action = 'Created';
    item.user = this.user;
    item.userId = this.user.id;
    this.request.requestHistory = [];
    this.request.requestHistory.push(item);

    this.requestService.create(this.request).subscribe(value => {
      if(value) {
        if(!this.request.id) {
          this.snackService.success("Success", "You have sending a New Copyrignt Requestment.")
        }
        else {
          this.snackService.success("Success", "You have saved the Copyrignt Requestment.")
        }

        this.ngOnInit();
      }
      else {
        this.snackService.error("Error", "Sorry, we had a problem sending your New Copyrignt Requestment.")
      }
    })
  }

  filterCompanies(name: string) {
    if (name && name.length>1) {
      this.snackService.loading = true;

      this.companyService.getCompanies(name).subscribe(companies => {
        this.companies = companies;
        this.companyInput.openPanel();
        this.snackService.loading = false;
      })
    }
    else {
      this.companies = [];
    }

    this.form.patchValue({ companyId: undefined });
    this.form.patchValue({ copyrightId: undefined });
    this.copyrights = [];
  }

  getCompanyName(company: Company) {
    return company.name;
  }

  selectCompany(company: Company) {
    this.company = company;
    this.form.patchValue({ companyId: company.id });
    this.filterCopyrights();
  }

  filterCopyrights() {
    if (this.company && this.company.id != 0) {
      this.companies.forEach(c => {
        if (c.id == this.company.id) {
          this.copyrights = c.copyrights;

          var ids: Array<number> = [];
          if(this.user.type=="Company") { ids.push(this.user.company!.id); }
          ids.push(c.id);
          this.userService.retriveAllEmployees(ids).subscribe(values => {
            if(values) { this.assignedPeople = values; }
            else { this.assignedPeople = []; }
          })

          this.generateAssigments(c)
        }
      })
    }
    else {
      this.copyrights = [];
    }

    this.form.patchValue({ copyrightId: undefined });
  }

  setCopyright() {
    if (this.form.value.copyrightId != 0) {
      this.copyrights.forEach(c => {
        if(c.id==this.form.value.copyrightId) {
          this.copyright = c;
          this.form.patchValue({ description: c.text });
          this.form.patchValue({ copyrightName: c.name });
          this.form.get('description')?.disable();
        }
      })
    }
    else {
      this.form.patchValue({ copyrightName: "" });
      this.form.patchValue({ description: "" });
      this.form.get('description')?.enable();
    }
  }

  generateAssigments(company: Company | undefined = undefined) {
    this.requestAssignments = [];

    var newRequestCopyrightAssign: RequestCopyrightAssignment = new RequestCopyrightAssignment();
    newRequestCopyrightAssign.userId = this.user.id;
    newRequestCopyrightAssign.user = this.user;
    newRequestCopyrightAssign.email = this.user.email;
    newRequestCopyrightAssign.permission = 'Edit';
    newRequestCopyrightAssign.name = "-";
    newRequestCopyrightAssign.canBeRemoved = false;
    if(this.user.type=='Person') { newRequestCopyrightAssign.name = this.user.person!.name + " " + this.user.person!.surname; }
    else { newRequestCopyrightAssign.name = this.user.company!.name; }
    
    this.requestAssignments.push(newRequestCopyrightAssign);

    if(company && company.user) {
      var newRequestCopyrightAssign: RequestCopyrightAssignment = new RequestCopyrightAssignment();
      newRequestCopyrightAssign.userId = company.user.id;
      newRequestCopyrightAssign.user = company.user;
      newRequestCopyrightAssign.email = company.user.email;
      newRequestCopyrightAssign.permission = 'Reply';
      newRequestCopyrightAssign.name = "-";
      newRequestCopyrightAssign.canBeRemoved = false;
      newRequestCopyrightAssign.name = company.name;
      
      this.requestAssignments.push(newRequestCopyrightAssign);
    }
  }

  setPanel(value: number) {
    this.panel = value;
    this.cdref.detectChanges();
  }

  visibility(visibility: string) {
    this.form.patchValue({ visibility: visibility });
    this.accordion.closeAll();
  }

  addActivationDate() {
    this.mensagemErroActivationDate = "";

    if (this.form.value.activationDateId == 0) {
      this.mensagemErroActivationDate = "Select an Activation Type!";
    }
    else if (this.form.value.activationDateDate == "") {
      this.mensagemErroActivationDate = "Select an Activation Date!";
    }
    else if (new Date(this.form.value.activationDateDate).getTime() < new Date().getTime()) {
      this.mensagemErroActivationDate = "The date must be greater than today!";
    }
    else {
      var newRequestCopyrightActivationDate: RequestCopyrightActivationDate = new RequestCopyrightActivationDate();
      newRequestCopyrightActivationDate.date = this.form.value.activationDateDate instanceof Date ? (this.form.value.activationDateDate as Date).toISOString().substring(0, 10) : this.form.value.activationDateDate;
      newRequestCopyrightActivationDate.activationDateId = this.form.value.activationDateId;

      this.activationDates.forEach(ad => {
        if (ad.id == this.form.value.activationDateId) { newRequestCopyrightActivationDate.activationDate = ad; }
      })

      this.form.patchValue({ activationDateId: 0 });
      this.form.patchValue({ activationDateDate: "" });

      this.requestActivationDates.push(newRequestCopyrightActivationDate);
      this.cdref.detectChanges();
    }
  }

  loadScripts() {
    const dynamicScripts = [
      "assets/assets2/libs/quill/quill.min.js",
      "assets/assets2/js/quill-editor.js",
      "assets/assets2/libs/flatpickr/flatpickr.min.js"];

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

  dataCheck() {
    this.mensagemErroData = "";
    var start: Date = new Date(this.form.value.start);
    var end: Date = new Date(this.form.value.end);
    
    this.form.patchValue({ startDate: start });
    this.form.patchValue({ endDate: end });

    if (start.getTime() < new Date().getTime()) {
      this.mensagemErroData = "Start date must be greted than today!"
      return false;
    }
    else if (end.getTime() < new Date().getTime()) {
      this.mensagemErroData = "End date must be greted than today!"
      return false;
    }
    else if (start.getTime() > end.getTime()) {
      this.mensagemErroData = "End date must be greted Start date!"
      return false;
    }
    else if (!this.form.value.start || this.form.value.start == "") {
      return false;
    }
    else if (!this.form.value.end || this.form.value.end == "") {
      return false;
    }
    else {
      return true;
    }
  }

  panelIncrement(qtd: number) {
    this.panel = this.panel + qtd;
    this.cdref.detectChanges();
  }

  verify1() {
    this.limparErros();
    this.progressBar();

    if (!this.form.value.companyId || this.form.value.companyId == 0) { return true; }
    if (!this.form.value.copyrightId) { return true; }
    else if(this.form.value.copyrightId == 0 && (this.form.value.copyrightName=="" || !this.form.value.description || this.form.value.description == "")) { return true; }
    if (!this.form.value.objective || this.form.value.objective == "") { return true; }

    return false;
  }

  verify2() {
    this.limparErros();
    this.progressBar();

    if (this.dataCheck() == false) { return true; }
    //if (this.requestActivationDates.length == 0) { return true; }
    if (!this.form.value.attributionDetails || this.form.value.attributionDetails == "") { return true; }
    if (!this.form.value.reportingFrequency || this.form.value.reportingFrequency == "") { return true; }

    return false;
  }

  verify3() {
    this.limparErros();
    this.progressBar();

    if (!this.form.value.geograficScopes || (this.form.value.geograficScopes as Array<any>).length == 0) { return true; }
    if (!this.form.value.mediaChannels || (this.form.value.mediaChannels as Array<any>).length == 0) { return true; }
    if (!this.form.value.contentElements || (this.form.value.contentElements as Array<any>).length == 0) { return true; }
    if (!this.form.value.complianceMeasures || (this.form.value.complianceMeasures as Array<any>).length == 0) { return true; }
    if (!this.form.value.metrics || (this.form.value.metrics as Array<any>).length == 0) { return true; }

    return false;
  }

  verify4() {
    this.limparErros();
    this.progressBar();

    if (!this.form.value.visibility || this.form.value.visibility == "") { return true; }
    if (this.requestAssignments.length == 0) { return true; }

    return false;
  }

  verify5() {
    this.limparErros();
    this.progressBar();

    //if (!this.form.value.picture || this.form.value.picture == "") { return true; }
    
    return false;
  }

  progressBar() {
    var progress = 0;

    if (this.form.value.companyId > 0) { progress++; }
    if (this.form.value.copyrightId != undefined) { progress++; }
    if (this.form.value.objective != "") { progress++; }
    if (this.form.value.attributionDetails != "") { progress++; }
    if (this.form.value.reportingFrequency != "") { progress++; }
    //if(this.dataCheck()) { progress++; }
    if (this.form.value.geograficScopes && (this.form.value.geograficScopes as Array<any>).length > 0) { progress++; }
    if (this.form.value.mediaChannels && (this.form.value.mediaChannels as Array<any>).length > 0) { progress++; }
    if (this.form.value.contentElements && (this.form.value.contentElements as Array<any>).length > 0) { progress++; }
    if (this.form.value.complianceMeasures && (this.form.value.complianceMeasures as Array<any>).length > 0) { progress++; }
    if (this.form.value.metrics && (this.form.value.metrics as Array<any>).length > 0) { progress++; }
    //if (this.requestActivationDates && this.requestActivationDates.length > 0) { progress++; }
    if (this.form.value.visibility && this.form.value.visibility != "") { progress++; }
    //if (this.form.value.picture && this.form.value.picture != "") { progress++; }

    progress = (progress / 11) * 50;

    if(this.panel>=2) { progress = progress + 10; }
    if(this.panel>=3) { progress = progress + 10; }
    if(this.panel>=4) { progress = progress + 10; }
    if(this.panel>=5) { progress = progress + 10; }
    if(this.panel>=6) { progress = progress + 10; }

    this.progress = progress + "%";
  }

  limparErros() {
    this.mensagem = "";
    this.mensagemErro = "";
  }

  assign() {
    this.mensagemErroAssigment = "";

    if (!this.form.value.invitePersonId || this.form.value.invitePersonId == '') {
      this.mensagemErroAssigment = "Select a person within the partinership!";
    }
    else if (this.form.value.invitePersonEmail == "") {
      this.mensagemErroAssigment = "Type an email to assign the person!";
    }
    else if (!this.form.value.invitePersonPermission || this.form.value.invitePersonPermission=="") {
      this.mensagemErroAssigment = "Select a permission!";
    }
    else {
      var check = false;

      this.requestAssignments.forEach(ea => {
        if(this.form.value.invitePersonEmail==ea.email) {
          check = true;
        }
      })

      if(!check) {
        var newRequestCopyrightAssign: RequestCopyrightAssignment = new RequestCopyrightAssignment();
        if(this.form.value.invitePersonId && this.form.value.invitePersonId>0) {
          newRequestCopyrightAssign.userId = this.form.value.invitePersonId;
        }
        
        newRequestCopyrightAssign.email = this.form.value.invitePersonEmail;
        newRequestCopyrightAssign.permission = this.form.value.invitePersonPermission;
        newRequestCopyrightAssign.name = "-";
        newRequestCopyrightAssign.canBeRemoved = true;
  
        this.assignedPeople.forEach(ap => {
          if(ap.id==this.form.value.invitePersonId) {
            if(ap.type=='Person') { newRequestCopyrightAssign.name = ap.person!.name + " " + ap.person!.surname; }
            else { newRequestCopyrightAssign.name = ap.company!.name; }

            newRequestCopyrightAssign.user = ap;
          }
        });
  
        this.form.patchValue({ invitePersonId: 0 });
        this.form.patchValue({ invitePersonEmail: "" });
        this.form.patchValue({ invitePersonPermission: "" });
  
        this.requestAssignments.push(newRequestCopyrightAssign);
      }
      else {
        this.mensagemErroAssigment = "There is an assigned person with this email!";
      }
    }
  }

  onRemoveAssign(ev: any, i: any) {
    if (ev.detail.role == "confirm") {
      this.requestAssignments.splice(i, 1)
    }
  }

  setAssignEmail() {
    var email = "";

    this.assignedPeople.forEach(ap => {
      if(ap.id==this.form.value.invitePersonId) {
        email = ap.email;
      }
    });

    this.form.patchValue({ invitePersonEmail: email });

    if(this.form.value.invitePersonId && this.form.value.invitePersonId!=0) {
      this.form.get('invitePersonEmail')?.disable();
    }
    else {
      this.form.get('invitePersonEmail')?.enable();
    }
  }

  selectFile(event: any) {
    if(event.target.files.length>0) {
      
      const formData = new FormData();
      formData.append('sampleFile', event.target.files[0]);

      this.fileService.attachFileCopyright(this.post.id, formData).subscribe(src => {
        this.imageSrc = environment.serverOrigin + "/files/request/" + src.name;
        this.form.patchValue({ picture: this.imageSrc });
        this.cdref.detectChanges();
      })
    }
  }

  selectFileAttachment(event: any) {
    if(event.target.files.length>0) {
      const formData = new FormData();
      formData.append('sampleFile', event.target.files[0]);

      this.fileService.attachFileCopyright(this.post.id, formData).subscribe(src => {
        var file: File = new File();
        file.name = this.form.value.fileName;
        file.path = environment.serverOrigin + "/files/request/" + src.name;
        this.requestFiles.push(file);

        this.form.patchValue({ fileName: '' });
      })
    }
  }

  removeFile(i: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: "delete"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.requestFiles.splice(i, 1);
        this.cdref.detectChanges();
      }
    });
  }

  removeAssigment(i: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: "delete"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.requestAssignments.splice(i, 1);
        this.cdref.detectChanges();
      }
    });
  }

  removeActivationDate(i: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: "delete"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.requestActivationDates.splice(i, 1);
        this.cdref.detectChanges();
      }
    });
  }

  getFullName() {
    return this.user.type=='Person' ? this.user.person!.name + " " + this.user.person!.surname : this.user.company!.name;
  }

  getCompany() {
    return this.company.name;
  }

  getIndustry() {
    return this.company.industry?.name;
  }

  getCopyright() {
    var name = "";

    if(this.form.value.copyrightId!=0) {
      this.copyrights.forEach(c => {
        if(c.id==this.form.value.copyrightId) {
          name = c.name;
        }
      })
    }
    else {
      return this.form.value.copyrightName;
    }

    return name;
  }

  getLocationName() {
    return this.company.city?.name + ", " + this.company.city?.state.name + ", " + this.company.city?.state.country.name;
  }
}
