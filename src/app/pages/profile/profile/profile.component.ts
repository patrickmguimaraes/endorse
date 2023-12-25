import { ChangeDetectorRef, Component, OnChanges, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Follower } from '../../../models/follower';
import { User } from '../../../models/user.model';
import { AuthenticationService } from '../../../services/authentication.service';
import { FollowerService } from '../../../services/follower.service';
import { UserService } from '../../../services/user.service';
import { ReloadComponent } from '../../reload/reload.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { HeaderComponent } from '../../../components/header/header.component';
import { ImagePipe } from '../../../pipes/image.pipe';
import { PostsComponent } from '../../../components/posts/posts.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule,
    ImagePipe,
    RouterModule,
    HeaderComponent,
    PostsComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent extends ReloadComponent implements OnInit, OnChanges {
  profile: User;
  me: User = new User();
  profilePicture: string;
  followed: Follower | null;
  isMe: boolean = true;

  constructor(public override router:Router, private authService: AuthenticationService, private userService: UserService, private cdref: ChangeDetectorRef, private route: ActivatedRoute,
    private followerService: FollowerService, private titleService: Title) {
    super(router);
    //this.loadScripts();
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false
    }
  }

  ngOnInit() {
    this.ngOnChanges();
  }

  ngOnChanges() {
    this.authService.getUser().subscribe(user => {
      if(user) {
        this.me = user;

        if(this.route.snapshot.params['userId']) {
          this.userService.findByUsername(this.route.snapshot.params['userId']).subscribe(value => {
            if(value) {
              this.profile = value;
              this.setProfilePicture();
              this.titleService.setTitle("Endorse an Idea - " + this.getName(this.profile));

              this.followerService.isFollowing(this.me.id, this.profile.id).subscribe(value => {
                this.followed = value;
                this.cdref.detectChanges();
              })

              this.isMe = this.profile.id==this.me.id;
            }
            else {
              this.router.navigate(["page-not-found"]);
            }
          })
        }
        else {
          this.router.navigate(["/"]);
        }
      }
    })
  }

  loadScripts() {
    const dynamicScripts = [
      "assets/assets2/libs/jsvectormap/js/job-candidate-details.js"];

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

  setProfilePicture() {
    this.profilePicture = environment.serverOrigin + "/files/users/undefined/profile.png";
    this.cdref.detectChanges();
    this.profilePicture = environment.serverOrigin + "/files/users/" + this.profile.id + "/profile.png";
    this.cdref.detectChanges();
    
    if(this.me.id==this.profile.id) {
      this.authService.setProfilePicture(this.profilePicture);
    }
  }

  selectFile(event: any) {
    if(event.target.files.length>0) {
      
      const formData = new FormData();
      formData.append('sampleFile', event.target.files[0]);

      this.userService.attachProfilePicture(formData, this.profile.id).subscribe(src => {
        this.setProfilePicture();
      })
    }
  }

  follow() {
    var data: Follower = new Follower();
    data.followed = this.profile;
    data.followedId = this.profile.id;
    data.follower = this.me;
    data.followerId = this.me.id;

    this.followerService.follow(data).subscribe(value => {
      this.followed = value;
      this.cdref.detectChanges();
    })
  }

  unfollow() {
    this.followerService.unfollow(this.followed!).subscribe(result => {
      if(result) {
        this.followed = null;
        this.cdref.detectChanges();
      }
    })
  }
}
