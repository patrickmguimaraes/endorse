import { Component, OnInit } from '@angular/core';
import { ReloadComponent } from '../reload/reload.component';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    ReactiveFormsModule,
    FormsModule,
    ToastrModule,
  ]
})
export class SettingsComponent extends ReloadComponent implements OnInit {

  constructor(public override router:Router) { 
    super(router);
  }

  ngOnInit() {}

}
