import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterOutlet, RouterModule, NavigationEnd, Router } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { ImagePipe } from '../../pipes/image.pipe';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user.model';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
import { ReloadComponent } from '../../pages/reload/reload.component';
import { Post } from '../../models/post';
import { NewPostComponent } from '../new-post/new-post.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule,
    ImagePipe,
    RouterModule,
    NewPostComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent extends ReloadComponent implements OnInit {
  @Input("profile") profile: User;
  @Input("idea") idea: Post | null;
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

  isActive(end: string) {
    return ('/' + this.profile.username + '/' + this.idea?.link + end)==this.router.url;
  }

  me() {
    this.authService.me();
  }
}
