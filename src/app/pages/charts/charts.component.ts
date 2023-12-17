import { Component, OnInit } from '@angular/core';
import { ReloadComponent } from '../reload/reload.component';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule,
  ]
})
export class ChartsComponent extends ReloadComponent  implements OnInit {

  constructor(public override router:Router) {
    super(router);
    //this.loadScripts();
   }

  ngOnInit() {}

  loadScripts() {
    const dynamicScripts = [
      "assets/assets2/libs/jsvectormap/js/jsvectormap.min.js",
      "assets/assets2/libs/jsvectormap/maps/world-merc.js",
      "assets/assets2/libs/apexcharts/apexcharts.min.js",
      "assets/assets2/js/crm-dashboard.js"];

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

}
