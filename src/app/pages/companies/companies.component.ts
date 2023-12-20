import { Component, OnInit } from '@angular/core';
import { ReloadComponent } from '../reload/reload.component';
import { ActivationDate } from '../../models/activation-date.model';
import { Category } from '../../models/category.model';
import { ComplianceMeasure } from '../../models/compliance-measure.model';
import { ContentElement } from '../../models/content-element.model';
import { GeograficScope } from '../../models/geografic-scope.model';
import { MediaChannel } from '../../models/media-channel.model';
import { Metric } from '../../models/metric.model';
import { CategoryService, CompanyService } from '../../services/company.service';
import { ActivationDateService, ComplianceMeasureService, ContentElementService, GeograficScopeService, MediaChannelService, MetricService } from '../../services/request.service';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule,
  ]
})
export class CompaniesComponent extends ReloadComponent  implements OnInit {
  activationDates: Array<ActivationDate> = [];
  complianceMeasures: Array<ComplianceMeasure> = [];
  contentElements: Array<ContentElement> = [];
  geograficScopes: Array<GeograficScope> = [];
  mediaChannels: Array<MediaChannel> = [];
  metrics: Array<Metric> = [];
  categories: Array<Category> = [];

  constructor(public override router:Router, private categoryService: CategoryService, private companyService: CompanyService, private activationDateService: ActivationDateService,
    private complianceMeasureService: ComplianceMeasureService, private contentElementService: ContentElementService, private geograficScopeService: GeograficScopeService,
    private mediaChannelService: MediaChannelService, private metricService: MetricService) { 
    super(router);
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
  }

}
