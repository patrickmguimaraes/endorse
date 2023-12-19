import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { User } from '../../models/user.model';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { FolderPage } from '../folder/folder.page';
import { ReloadComponent } from '../reload/reload.component';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ImagePipe } from '../../pipes/image.pipe';
import { Follower } from '../../models/follower';
import { FollowerService } from '../../services/follower.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule,
    ImagePipe
  ]
})
export class ProfileComponent extends ReloadComponent implements OnInit {
  user: User;
  me: User = new User();
  profilePicture: string;
  followed: Follower | null;

  constructor(public override router:Router, private authService: AuthenticationService, private userService: UserService, private cdref: ChangeDetectorRef, private route: ActivatedRoute,
    private followerService: FollowerService) {
    super(router);
    //this.loadScripts();
  }

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if(user) {
        this.me = user;

        if(this.route.snapshot.params['userId']) {
          this.userService.findByUsername(this.route.snapshot.params['userId']).subscribe(value => {
            if(value) {
              this.user = value;
              this.setProfilePicture();

              this.followerService.isFollowing(this.me.id, this.user.id).subscribe(value => {
                this.followed = value;
                this.cdref.detectChanges();
              })
            }
            else {
              this.reloadComponent(false, "page-not-found");
            }
          })
        }
        else {
          this.user = user;
          this.setProfilePicture();
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
    this.profilePicture = environment.serverOrigin + "/files/users/" + this.user.id + "/profile.png";
    this.cdref.detectChanges();
    
    if(this.me.id==this.user.id) {
      this.authService.setProfilePicture(this.profilePicture);
    }
  }

  selectFile(event: any) {
    if(event.target.files.length>0) {
      
      const formData = new FormData();
      formData.append('sampleFile', event.target.files[0]);

      this.userService.attachProfilePicture(formData, this.user.id).subscribe(src => {
        this.setProfilePicture();
      })
    }
  }

  follow() {
    var data: Follower = new Follower();
    data.followed = this.user;
    data.followedId = this.user.id;
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
