import { ChangeDetectorRef, Component, EventEmitter, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { AuthenticationService } from '../../services/authentication.service';
import { EndorseService } from '../../services/endorse.service';
import { environment } from '../../../environments/environment';
import { ReloadComponent } from '../reload/reload.component';
import { FollowComponent } from '../../components/follow/follow.component';
import { PostComponent } from '../../components/post/post.component';
import { NewPostComponent } from '../../components/new-post/new-post.component';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ImagePipe } from '../../pipes/image.pipe';
import { Follower } from '../../models/follower';
import { UserService } from '../../services/user.service';
import { FollowerService } from '../../services/follower.service';
import { Post } from '../../models/post';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule,
    ImagePipe, 
    FollowComponent, 
    PostComponent, 
    NewPostComponent
  ]
})
export class HomeComponent extends ReloadComponent implements OnInit {
  user: User = new User();
  profilePicture: string = environment.serverOrigin + "/files/users/" + this.user.id + "/profile.png";
  posts: EventEmitter<Post> = new EventEmitter<Post>();
  followers: number = 0;
  followeds: number = 0;

  constructor(public override router:Router, private authService: AuthenticationService, private endorseService: EndorseService, private cdref: ChangeDetectorRef,
    private userService: UserService, private followService: FollowerService) { 
      super(router);
      this.loadScripts();
  }

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if(user) {
        this.user = user;

        if(this.user.followers) {
          this.user.followers.forEach((val, index) => {
            if(index<5) {
              this.userService.get(val.followedId).subscribe(res => {
                val.followed = res;
              })
            }
          })
        }

        if(this.user.followeds) {
          this.user.followeds.forEach((val, index) => {
            if(index<5) {
              this.userService.get(val.followerId).subscribe(res => {
                val.follower = res;
              })
            }
          })
        }

        this.followService.followingNumber(this.user.id, this.user.id).subscribe(values => {
          this.followers = values.followers;
          this.followeds = values.followeds;
        })
      }
    })

    this.authService.getUserPicture().subscribe(userPic => {
      this.profilePicture = environment.serverOrigin + "/files/users/undefined/profile.png";
      this.cdref.detectChanges();
      this.profilePicture = userPic;
      this.cdref.detectChanges();
    })
  }

  addPost(post: Post) {
    post.user = this.user;
    this.posts.emit(post);
    this.cdref.detectChanges();
  }
  
  loadScripts() {
    const dynamicScripts = [
      "assets/js/sticky.js"
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

  getProfessionIndustry() {
    return this.user.type=='Company' ? this.user.company!.category?.name : this.user.person!.profession;
  }

  onUnfollow(follower: Follower) {
    this.user.followers.forEach(f => {
      if(follower.followerId==f.followerId && follower.followedId==f.followedId) {
        this.user.followers.splice(this.user.followers.indexOf(f), 1);
      }
    })
  }

  onFollower(follower: Follower) {
    this.followers++;
  }

  onUnfollower(follower: Follower) {
    this.followers--;
  }
}
