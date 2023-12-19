import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { Follower } from '../../models/follower';
import { User } from '../../models/user.model';
import { ReloadComponent } from '../../pages/reload/reload.component';
import { FollowerService } from '../../services/follower.service';
import { environment } from '../../../environments/environment';
import { ImagePipe } from '../../pipes/image.pipe';

@Component({
  selector: 'app-follow',
  templateUrl: './follow.component.html',
  styleUrls: ['./follow.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule,
    ImagePipe
  ]
})
export class FollowComponent extends ReloadComponent implements OnInit, OnChanges {
  @Input("user") user: User;
  suggests: Array<User> = [];
  justFollowed: Array<Follower> = [];
  loading: boolean = true;
  
  constructor(public override router:Router, private followerService: FollowerService, private changeDetector : ChangeDetectorRef) { 
    super(router);
    //this.loadScripts();
  }

  ngOnInit(): void {
    //this.ngOnChanges();
  }
  
  ngOnChanges(): void {
    if(this.user) {
      this.followerService.suggests(this.user.id, 5).subscribe(values => {
        this.suggests = values;
        this.changeDetector.detectChanges();
      })
    }
  }

  follow(user: User) {
    var data: Follower = new Follower();
    data.followed = user;
    data.followedId = user.id;
    data.follower = this.user;
    data.followerId = this.user.id;

    this.followerService.follow(data).subscribe(value => {
      if(value) {
        this.justFollowed.push(data);
        this.changeDetector.detectChanges();
      }
    })
  }

  unfollow(user: User) {
    this.justFollowed.forEach(jf => {
      if(jf.followedId==user.id) {
        this.followerService.unfollow(jf).subscribe(result => {
          if(result) {
            this.justFollowed.splice(this.justFollowed.indexOf(jf), 1);
            this.changeDetector.detectChanges();
          }
        })
      }
    })
  }

  loadScripts() {
    const dynamicScripts = [""];

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

  isFollowed(user: User) {
    var isFollowed = false;

    this.justFollowed.forEach(jf => {
      if(jf.followedId==user.id) {
        isFollowed = true;
      }
    })

    return isFollowed;
  }
}
