import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { ChildrenOutletContexts, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterEvent, RouterModule, RouterOutlet } from '@angular/router';
import { SnackbarService } from './utils/snackbar.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule,  
    TranslateModule,
    RouterModule,
    HttpClientModule,
    RouterModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(public snack: SnackbarService, private router: Router, public authService: AuthenticationService, private contexts: ChildrenOutletContexts) {
    authService.getUser().subscribe(value => {
      setTimeout(() => {
        this.snack.loading = false;
        this.loadScripts();
      }, 2500)
    });
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    
  }

  loadScripts() {
    if(document) {
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
  }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
