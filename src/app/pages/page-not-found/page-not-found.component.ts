import { Component, OnInit } from '@angular/core';
import { ReloadComponent } from '../reload/reload.component';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule,
  ]
})
export class PageNotFoundComponent extends ReloadComponent implements OnInit {

  constructor(public override router:Router) {
    super(router);
    let html = document.querySelector("html");
    html?.style.setProperty("--primary-rgb", `38, 111, 254`);
   }

  ngOnInit() {}

}
