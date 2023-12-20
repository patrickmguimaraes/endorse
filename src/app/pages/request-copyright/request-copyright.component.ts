import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ActivationDate } from '../../models/activation-date.model';
import { Category } from '../../models/category.model';
import { Company } from '../../models/company.model';
import { ComplianceMeasure } from '../../models/compliance-measure.model';
import { ContentElement } from '../../models/content-element.model';
import { Copyright } from '../../models/copyright.model';
import { RequestActivationDate } from '../../models/request-activation-date.model';
import { RequestAssignment } from '../../models/request-assignment.model';
import { RequestComplianceMeasure } from '../../models/request-compliance-measure.model';
import { RequestContentElement } from '../../models/request-content-element.model';
import { RequestGeograficScope } from '../../models/request-geografic-scope.model';
import { RequestHistory } from '../../models/request-history.model';
import { RequestMediaChannel } from '../../models/request-media-channel.model';
import { RequestMetric } from '../../models/request-metric.model';
import { Request } from '../../models/request.model';
import { File } from '../../models/file.model';
import { GeograficScope } from '../../models/geografic-scope.model';
import { MediaChannel } from '../../models/media-channel.model';
import { Metric } from '../../models/metric.model';
import { User } from '../../models/user.model';
import { AuthenticationService } from '../../services/authentication.service';
import { CategoryService, CompanyService } from '../../services/company.service';
import { ActivationDateService, ComplianceMeasureService, ContentElementService, RequestService, GeograficScopeService, MediaChannelService, MetricService } from '../../services/request.service';
import { OpenAIService } from '../../services/openAI.service';
import { UserService } from '../../services/user.service';
import { SnackbarService } from '../../utils/snackbar.service';
import { environment } from '../../../environments/environment';
import { ReloadComponent } from '../reload/reload.component';
import { DatePipe } from '@angular/common';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ImagePipe } from '../../pipes/image.pipe';

@Component({
  selector: 'app-request-copyright',
  templateUrl: './request-copyright.component.html',
  styleUrls: ['./request-copyright.component.scss'],
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
  ]
})
export class RequestCopyrightComponent extends ReloadComponent implements OnInit {
  form: FormGroup;
  user: User = new User();
  @ViewChild('editor') editor: ElementRef;
  request: Request = new Request();
  categories: Array<Category> = [];
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
  requestActivationDates: Array<RequestActivationDate> = [];
  requestAssignments: Array<RequestAssignment> = [];
  requestFiles: Array<File> = []
  geograficScopesSelected: Array<GeograficScope> = [];
  panel: number = 1;
  progress: string = "0%"
  loadingAI: boolean = true;
  @ViewChild('accordion', {static:false}) accordion: MatAccordion;
  assignedPeople: Array<User> = [];
  imageSrc: any = "./../../../assets/images/add-picture.png";
  @ViewChild('reviewProposal') reviewProposal: ElementRef;

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

  constructor(private _adapter: DateAdapter<any>, private formBuilder: FormBuilder, authService: AuthenticationService, private openAIService: OpenAIService, private app: SnackbarService,
    private renderer: Renderer2, private categoryService: CategoryService, private companyService: CompanyService, private activationDateService: ActivationDateService,
    private complianceMeasureService: ComplianceMeasureService, private contentElementService: ContentElementService, private geograficScopeService: GeograficScopeService,
    private mediaChannelService: MediaChannelService, private metricService: MetricService, private requestService: RequestService, public override router:Router,
    private userService: UserService) {
      super(router);
    //this.loadScripts();

    this.form = formBuilder.group({ ...this.request, ... { activationDateId: 0, fileName: '', visibility: '', invitePersonId: 0, invitePersonEmail: '', invitePersonPermission: ''}, ...{ activationDateDate: new Date(new Date().getTime() + 86400000).toISOString().substring(0, 10) }, ...{ geograficScopes: [] }, ...{ mediaChannels: [] }, ...{ contentElements: [] }, ...{ complianceMeasures: [] }, ...{ metrics: [] } });
    this.form.get('invitePersonEmail')?.disable();

    authService.getUser().subscribe(user => {
      if (user) {
        this.user = user;
        this.generateAssigments();
      }
    })

    this._adapter.setLocale('fr');
  }

  ngOnInit() {
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories;
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

  requestRequest() {
    this.request = this.form.value;
    this.request.userId = this.user.id;
    this.request.files = this.requestFiles;
    this.request.requestAssignments = this.requestAssignments;
    this.request.requestActivationDates = this.requestActivationDates;
    this.request.startDate = new Date(this.request.start);
    this.request.endDate = new Date(this.request.end);

    this.request.requestComplianceMeasures = [];
    (this.form.value.complianceMeasures as Array<ComplianceMeasure>).forEach(value => {
      var item: RequestComplianceMeasure = new RequestComplianceMeasure();
      //item.request = this.request;
      item.complianceMeasure = value;
      item.complianceMeasureId = value.id;
      this.request.requestComplianceMeasures.push(item);
    })

    this.request.requestContentElements = [];
    (this.form.value.contentElements as Array<ContentElement>).forEach(value => {
      var item: RequestContentElement = new RequestContentElement();
      //item.request = this.request;
      item.contentElement = value;
      item.contentElementsId = value.id;
      this.request.requestContentElements.push(item);
    })

    this.request.requestGeograficScopes = [];
    (this.form.value.geograficScopes as Array<GeograficScope>).forEach(value => {
      var item: RequestGeograficScope = new RequestGeograficScope();
      //item.request = this.request;
      item.geograficScope = value;
      item.geograficScopeId = value.id;
      this.request.requestGeograficScopes.push(item);
    })

    this.request.requestMediasChannels = [];
    (this.form.value.mediaChannels as Array<MediaChannel>).forEach(value => {
      var item: RequestMediaChannel = new RequestMediaChannel();
      //item.request = this.request;
      item.mediaChannel = value;
      item.mediaChannelId = value.id;
      this.request.requestMediasChannels.push(item);
    })

    this.request.requestMetrics = [];
    (this.form.value.metrics as Array<Metric>).forEach(value => {
      var item: RequestMetric = new RequestMetric();
      //item.request = this.request;
      item.metric = value;
      item.metricId = value.id;
      this.request.requestMetrics.push(item);
    })

    var item: RequestHistory = new RequestHistory();
    //item.request = this.request;
    item.date = new Date();
    item.action = 'Created';
    item.user = this.user;
    item.userId = this.user.id;
    this.request.requestHistory = [];
    this.request.requestHistory.push(item);

    this.request.start = this.request.startDate.toISOString().substring(0, 10);
    this.request.end = this.request.endDate.toISOString().substring(0, 10);

    this.requestService.create(this.request).subscribe(value => {
      if(value) {
        this.reloadComponent(false, '/timeline');
      }
      else {
        this.mensagemErro = "Sorry, we had a problem sending your New Requestment."
      }
    })
  }

  filterCompanies() {
    if (this.form.value.categoryId != 0) {
      this.app.loading = true;

      this.companyService.findByCategory(this.form.value.categoryId).subscribe(companies => {
        this.companies = companies;
        this.app.loading = false;
      })
    }
    else {
      this.companies = [];
    }

    this.form.patchValue({ companyId: 0 });
    this.form.patchValue({ copyrightId: 0 });
    this.copyrights = [];
  }

  filterCopyrights() {
    if (this.form.value.companyId != 0) {
      this.companies.forEach(c => {
        if (c.id == this.form.value.companyId) {
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

    this.form.patchValue({ copyrightId: 0 });
  }

  generateAssigments(company: Company | undefined = undefined) {
    this.requestAssignments = [];

    var newRequestAssign: RequestAssignment = new RequestAssignment();
    newRequestAssign.userId = this.user.id;
    newRequestAssign.user = this.user;
    newRequestAssign.email = this.user.email;
    newRequestAssign.permission = 'Edit';
    newRequestAssign.name = "-";
    newRequestAssign.canBeRemoved = false;
    if(this.user.type=='Person') { newRequestAssign.name = this.user.person!.name + " " + this.user.person!.surname; }
    else { newRequestAssign.name = this.user.company!.name; }
    
    this.requestAssignments.push(newRequestAssign);

    if(company && company.user) {
      var newRequestAssign: RequestAssignment = new RequestAssignment();
      newRequestAssign.userId = company.user.id;
      newRequestAssign.user = company.user;
      newRequestAssign.email = company.user.email;
      newRequestAssign.permission = 'Reply';
      newRequestAssign.name = "-";
      newRequestAssign.canBeRemoved = false;
      newRequestAssign.name = company.name;
      
      this.requestAssignments.push(newRequestAssign);
    }
  }

  setPanel(value: number) {
    if(this.panel==4) { this.onTextChange(); }
    if(value==4) { this.getAIText() }

    this.panel = value;

    if(this.panel==7) { this.setRequestTextReview(); }
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
      var newRequestActivationDate: RequestActivationDate = new RequestActivationDate();
      newRequestActivationDate.date = this.form.value.activationDateDate instanceof Date ? (this.form.value.activationDateDate as Date).toISOString().substring(0, 10) : this.form.value.activationDateDate;
      newRequestActivationDate.activationDateId = this.form.value.activationDateId;

      this.activationDates.forEach(ad => {
        if (ad.id == this.form.value.activationDateId) { newRequestActivationDate.activationDate = ad; }
      })

      this.form.patchValue({ activationDateId: 0 });
      this.form.patchValue({ activationDateDate: "" });

      this.requestActivationDates.push(newRequestActivationDate);
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
    if(this.panel==4) { this.onTextChange(); }
    
    this.panel = this.panel + qtd;

    if(this.panel==4) { this.getAIText(); }
    else if(this.panel==7) { this.setRequestTextReview(); }
  }

  verify1() {
    this.limparErros();
    this.progressBar();

    if (!this.form.value.name || this.form.value.name == "") { return true; }
    if (!this.form.value.categoryId || this.form.value.categoryId == 0) { return true; }
    if (!this.form.value.companyId || this.form.value.companyId == 0) { return true; }
    if (!this.form.value.copyrightId || this.form.value.copyrightId == 0) { return true; }
    if (!this.form.value.description || this.form.value.description == "") { return true; }
    if (!this.form.value.objective || this.form.value.objective == "") { return true; }

    return false;
  }

  verify2() {
    this.limparErros();
    this.progressBar();

    if (this.dataCheck() == false) { return true; }
    if (this.requestActivationDates.length == 0) { return true; }
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

    if(this.request.requestText=="") { return true; }

    return false;
  }

  verify5() {
    this.limparErros();
    this.progressBar();

    if (!this.form.value.visibility || this.form.value.visibility == "") { return true; }
    if (this.requestAssignments.length == 0) { return true; }

    return false;
  }

  verify6() {
    this.limparErros();
    this.progressBar();

    if (!this.form.value.picture || this.form.value.picture == "") { return true; }
    
    return false;
  }

  getAIText() {
    this.loadingAI = true;

    if(this.request.requestText=="") {
      this.request = this.form.value;

      var companyName = "";
      var companyCategory = "";
      var companyCopyright = "";
      var activiteDate = "";
      var media = "";
      var geografic = "";
      var contentElements = "";
      var complianceMeasures = "";
      var metrics = "";
  
      this.companies.forEach(c => {
        if(c.id==this.form.value.companyId) { companyName = c.name }
      });
  
      this.categories.forEach(c => {
        if(c.id==this.form.value.categoryId) { companyCategory = c.name }
      });
  
      this.copyrights.forEach(c => {
        if(c.id==this.form.value.copyrightId) { companyCopyright = c.name }
      });
  
      this.request.requestActivationDates = this.requestActivationDates;
      this.requestActivationDates.forEach(e => {
        activiteDate = activiteDate + e.activationDate.name + " on " + e.date + ", ";
      });
  
      this.request.requestMediasChannels = [];
      (this.form.value.mediaChannels as Array<MediaChannel>).forEach(mc => {
        media = media + mc.name + ", ";
  
        var emc: RequestMediaChannel = new RequestMediaChannel();
        emc.mediaChannel = mc;
        this.request.requestMediasChannels.push(emc);
      });
  
      this.request.requestGeograficScopes = [];
      (this.form.value.geograficScopes as Array<GeograficScope>).forEach(mc => {
        geografic = geografic + mc.name + ", ";
  
        var emc: RequestGeograficScope = new RequestGeograficScope();
        emc.geograficScope = mc;
        this.request.requestGeograficScopes.push(emc);
      });
      
      this.request.requestContentElements = [];
      (this.form.value.contentElements as Array<ContentElement>).forEach(mc => {
        contentElements = contentElements + mc.name + ", ";
  
        var emc: RequestContentElement = new RequestContentElement();
        emc.contentElement = mc;
        this.request.requestContentElements.push(emc);
      });
  
      this.request.requestComplianceMeasures = [];
      (this.form.value.complianceMeasures as Array<ComplianceMeasure>).forEach(mc => {
        complianceMeasures = complianceMeasures + mc.name + ", ";
  
        var emc: RequestComplianceMeasure = new RequestComplianceMeasure();
        emc.complianceMeasure = mc;
        this.request.requestComplianceMeasures.push(emc);
      });
  
      this.request.requestMetrics = [];
      (this.form.value.metrics as Array<Metric>).forEach(mc => {
        metrics = metrics + mc.name + ", ";
  
        var emc: RequestMetric = new RequestMetric();
        emc.metric = mc;
        this.request.requestMetrics.push(emc);
      });
  
      const details = {
        'Company Name': companyName,
        'Company Category': companyCategory,
        'Copyright Choosed': companyCopyright,
        'Campaign Title': this.form.value.name,
        'Campaign Description': this.form.value.description,
        'Campaign Objective': this.form.value.objective,
        'List of Media Channels': media,
        'List of Content Elements': contentElements,
        'Geographic Scope': geografic,
        'Start Date': (this.form.value.startDate as Date).toISOString().substring(0, 10),
        'End Date': (this.form.value.endDate as Date).toISOString().substring(0, 10),
        'List of Activation Dates': activiteDate,
        'Attribution Details': this.form.value.attributionDetails,
        'Compliance Measures': complianceMeasures,
        'List of Metrics': metrics,
        'Reporting Frequency': this.form.value.reportingFrequency,
        'Requester Name': this.user.type=='Person' ? this.user.person!.name + " " + this.user.person!.surname : this.user.company!.name,
        'Requester Position': this.user.type=='Person' ? this.user.person!.profession : this.user.company!.name + " is a business",
        'Requester Email': this.user.email,
        'Requester Phone': this.user.phone
      };
  
      let prompt = `
      Generate an HTML proposal for the campaign with the following details:

        1. Introduction:
          - Brief overview of the campaign.

        2. Campaign Details:
          - Company: ${details['Company Name']}
          - Company Category: ${details['Company Category']}
          - Copyright Choosed: ${details['Copyright Choosed']}
          - Campaign Title: ${details['Campaign Title']}
          - Description: ${details['Campaign Description']}
          - Dates: ${details['Start Date']} - ${details['End Date']}

        3. Objectives:
          - ${details['Campaign Objective']}

        4. Media Channels:
          - ${details['List of Media Channels']}

        5. Content Elements:
          - ${details['List of Content Elements']}

        6. Geographic Scope:
        - ${details['Geographic Scope']}

        7. Compliance Measures:
        - ${details['Compliance Measures']}

        8. Activation Dates:
        - ${details['List of Activation Dates']}

        9. Attribution Details:
        - ${details['Attribution Details']}

        10. Metrics:
        - ${details['List of Metrics']}

        11. Reporting Frequency:
        - ${details['Reporting Frequency']}

        11. Requester:
        - Requester Name: ${details['Requester Name']}
        - Requester Position: ${details['Requester Position']}
        - Requester Email: ${details['Requester Email']}
        - Requester Phone: ${details['Requester Phone']}.

        Styling and Formatting:
        - Preferred font: Times New Roman

        Dynamic Content:
        - Emphasize campaign dates and details.

        Additional Instructions:
        - Include a header with the campaign title.
        - Use a table format for metrics and attribution details.
      
    
  
      Campaign Duration: ${details['Start Date']} to ${details['End Date']}
      
      Attribution: ${details['Attribution Details']}
      
      Requester Name: ${details['Requester Name']}
      Requester Position: ${details['Requester Position']}
      Requester Email: ${details['Requester Email']}
      Requester Phone: ${details['Requester Phone']}.`;
  
      this.openAIService.generateRequest(prompt).subscribe(value => {
        this.loadingAI = false;
        
        setTimeout(() => {
          //this.loadScripts();
  
          setTimeout(() => {
            const html: string = value.choices[0].message.content;
            var body: string = html.substring(html.indexOf("<body>") + 7, html.indexOf("</body>"))
    
            body = body.replace("<h1>", "<h1 style=\"text-align: center;\">");
            body = body.replace(/[\r\n]/gm, '');
    
            this.appendToContainer(body);
          }, 500);
        }, 1000);
      })
    }
    else {
      setTimeout(() => {
        this.loadingAI = false;

        //this.loadScripts();

        setTimeout(() => {
          this.renderer.setProperty(this.editor.nativeElement, 'innerHTML', this.request.requestText);
          this.renderer.setProperty(this.reviewProposal, 'innerHTML', this.request.requestText);
        }, 500);
      }, 1000);
    }
  }

  appendToContainer(generatedHtml: string): void {
    try {
      const container = this.editor.nativeElement;
      const html = "<div class=\"ql-editor ql-blank\" data-gramm=\"false\" contenteditable=\"true\">" + generatedHtml + "</div>";
      this.renderer.setProperty(container, 'innerHTML', html);
      this.onTextChange();
    } catch (error) {
      console.log("error")
    }
  }

  onTextChange() {
    if(this.editor && this.editor.nativeElement) {
      this.request.requestText = "";

      (this.editor.nativeElement as HTMLDivElement).childNodes.forEach(child => {
        if((child as HTMLDivElement).outerHTML) { this.request.requestText = this.request.requestText + (child as HTMLDivElement).outerHTML; }
      })
    }
  }

  setRequestTextReview() {
    setTimeout(() => {
      if(this.reviewProposal && this.reviewProposal.nativeElement) {
        this.renderer.setProperty(this.reviewProposal.nativeElement, 'innerHTML', this.request.requestText);
      }
    }, 500);
  }

  progressBar() {
    var progress = 0;

    if (this.form.value.name != "") { progress++; }
    if (this.form.value.categoryId != 0) { progress++; }
    if (this.form.value.companyId != 0) { progress++; }
    if (this.form.value.copyrightId != 0) { progress++; }
    if (this.form.value.description != "") { progress++; }
    if (this.form.value.objective != "") { progress++; }
    if (this.form.value.attributionDetails != "") { progress++; }
    if (this.form.value.reportingFrequency != "") { progress++; }
    //if(this.dataCheck()) { progress++; }
    if (this.form.value.geograficScopes && (this.form.value.geograficScopes as Array<any>).length > 0) { progress++; }
    if (this.form.value.mediaChannels && (this.form.value.mediaChannels as Array<any>).length > 0) { progress++; }
    if (this.form.value.contentElements && (this.form.value.contentElements as Array<any>).length > 0) { progress++; }
    if (this.form.value.complianceMeasures && (this.form.value.complianceMeasures as Array<any>).length > 0) { progress++; }
    if (this.form.value.metrics && (this.form.value.metrics as Array<any>).length > 0) { progress++; }
    if (this.requestActivationDates && this.requestActivationDates.length > 0) { progress++; }
    if (this.form.value.visibility && this.form.value.visibility != "") { progress++; }
    if (this.form.value.picture && this.form.value.picture != "") { progress++; }

    progress = (progress / 16) * 40;

    if(this.panel>=2) { progress = progress + 10; }
    if(this.panel>=3) { progress = progress + 10; }
    if(this.panel>=4) { progress = progress + 10; }
    if(this.panel>=5) { progress = progress + 10; }
    if(this.panel>=6) { progress = progress + 10; }
    if(this.panel>=7) { progress = progress + 10; }

    this.progress = progress + "%";
  }

  limparErros() {
    this.mensagem = "";
    this.mensagemErro = "";
  }

  onRemove(ev: any, i: any) {
    if (ev.detail.role == "confirm") {
      this.requestActivationDates.splice(i, 1)
    }
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
        var newRequestAssign: RequestAssignment = new RequestAssignment();
        newRequestAssign.userId = this.form.value.invitePersonId;
        newRequestAssign.email = this.form.value.invitePersonEmail;
        newRequestAssign.permission = this.form.value.invitePersonPermission;
        newRequestAssign.name = "-";
        newRequestAssign.canBeRemoved = true;
  
        this.assignedPeople.forEach(ap => {
          if(ap.id==this.form.value.invitePersonId) {
            if(ap.type=='Person') { newRequestAssign.name = ap.person!.name + " " + ap.person!.surname; }
            else { newRequestAssign.name = ap.company!.name; }

            newRequestAssign.user = ap;
          }
        });
  
        this.form.patchValue({ invitePersonId: 0 });
        this.form.patchValue({ invitePersonEmail: "" });
        this.form.patchValue({ invitePersonPermission: "" });
  
        this.requestAssignments.push(newRequestAssign);
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

      this.requestService.attachFile(formData).subscribe(src => {
        this.imageSrc = environment.serverOrigin + "/files/request/" + src.name;
        this.form.patchValue({ picture: this.imageSrc });
      })
    }
  }

  selectFileAttachment(event: any) {
    if(event.target.files.length>0) {
      const formData = new FormData();
      formData.append('sampleFile', event.target.files[0]);

      this.requestService.attachFile(formData).subscribe(src => {
        var file: File = new File();
        file.name = this.form.value.fileName;
        file.path = environment.serverOrigin + "/files/request/" + src.name;
        this.requestFiles.push(file);

        this.form.patchValue({ fileName: '' });
      })
    }
  }

  onRemoveFile(ev: any, i: any) {
    if (ev.detail.role == "confirm") {
      this.requestFiles.splice(i, 1)
    }
  }

  getFullName() {
    return this.user.type=='Person' ? this.user.person!.name + " " + this.user.person!.surname : this.user.company!.name;
  }

  getCompany() {
    var name = "";

    this.companies.forEach(c => {
      if(c.id==this.form.value.companyId) {
        name = c.name;
      }
    })

    return name;
  }

  getIndustry() {
    var name = "";

    this.categories.forEach(c => {
      if(c.id==this.form.value.categoryId) {
        name = c.name;
      }
    })

    return name;
  }

  getCopyright() {
    var name = "";

    this.copyrights.forEach(c => {
      if(c.id==this.form.value.copyrightId) {
        name = c.name;
      }
    })

    return name;
  }
}
