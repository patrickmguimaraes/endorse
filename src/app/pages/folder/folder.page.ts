import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { User } from '../../models/user.model';
import { AuthenticationService } from '../../services/authentication.service';
import { environment } from '../../../environments/environment';
import { ReloadComponent } from '../reload/reload.component';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ToastrModule } from 'ngx-toastr';
import { ImagePipe } from '../../pipes/image.pipe';
import { UserService } from '../../services/user.service';
import { filter, map } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule,
    ImagePipe,
    RouterModule
  ]
})
export class FolderPage extends ReloadComponent implements OnInit {
  user: User = new User();
  profilePicture: string = environment.serverOrigin + "/files/users/" + this.user.id + "/profile.png";
  isSearching: boolean = false;
  searchText: string = "";
  searchResult: Array<User> = [];
  page: string;

  constructor(public override router:Router, public authService: AuthenticationService, private cdref: ChangeDetectorRef,
    private userService: UserService, private titleService: Title) {
    super(router);
    this.loadScripts();
  }

  ngOnInit(): void {
    this.router.events.subscribe((val) => {
      if((val instanceof NavigationEnd)) {
        this.page = this.router.url;
      }
    }); 

    this.authService.getUser().subscribe(user => {
      if(user) {
        this.user = user;
      }
    })

    this.authService.getUserPicture().subscribe(userPic => {
      this.profilePicture = environment.serverOrigin + "/files/users/undefined/profile.png";
      this.cdref.detectChanges();
      this.profilePicture = userPic;
      this.cdref.detectChanges();
    })
  }

  search() {
    if(this.searchText.length>=1) {
      this.userService.search(this.searchText).subscribe(values => {
        this.searchResult = values;
      })
    }
    else {
      this.searchResult = [];
    }
  }

  selectUserSearch(user: User) {
    this.searchText = this.getName(user);
  }

  closeDropdowns() {
    (document.getElementById("justADivOutside")?.click())
  }

  searchActive() {
    this.isSearching = true;
  }

  loadScripts() {
    const dynamicScripts = [
      "assets/js/customer-custom.js"
    ];

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

  logout() {
    this.authService.logout();
    this.reloadPage();
  }
}
