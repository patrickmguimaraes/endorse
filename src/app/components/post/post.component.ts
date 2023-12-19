import { CommonModule, SlicePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Endorse } from '../../models/endorse.model';
import { User } from '../../models/user.model';
import { EndorseService } from '../../services/endorse.service';
import { ImagePipe } from '../../pipes/image.pipe';
import { Post } from '../../models/post';
import { PostService } from '../../services/post.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { environment } from '../../../environments/environment';
import { ReloadComponent } from '../../pages/reload/reload.component';
import { Router } from '@angular/router';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { QuillModule } from 'ngx-quill';
import { DomSanitizer } from '@angular/platform-browser';
import { FollowerService } from '../../services/follower.service';
import { SnackbarService } from '../../utils/snackbar.service';
import { Follower } from '../../models/follower';

interface Panel {
  post: Post;
  showMore: boolean;
  height: number;
}

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ImagePipe,
    MatProgressSpinnerModule,
    TimeAgoPipe,
    QuillModule
  ]
})
export class PostComponent extends ReloadComponent implements OnChanges {
  @Input("user") user: User;
  @Input("onPost") onPost : EventEmitter<Post>;
  @Output("onUnfollow") onUnfollow: EventEmitter<Follower> = new EventEmitter<Follower>();
  posts: Array<Panel> = [];
  loading: boolean = true;
  page: number = 1;

  constructor(public override router:Router, private postService: PostService, private sanitizer: DomSanitizer, private changeDetector : ChangeDetectorRef,
    private followerService: FollowerService, private snack: SnackbarService) {
    super(router)
  }

  ngOnChanges(): void {
    this.loading = true;
    
    this.postService.newsFeed(this.user.id, 1, 10).subscribe(values => {
      values.rows.forEach(r => {
        this.posts.push({post: r, showMore: false, height: 0});
      })

      setTimeout(() => {
        this.loading = false;
        this.setHeights();
      }, 500);
    })

    this.onPost.subscribe(post => {
      this.loading = true;
      
      this.posts.unshift({post: post, showMore: false, height: 0});

      setTimeout(() => {
        this.changeDetector.detach();
        this.loading = false;
        this.setHeights();
      }, 500);
    })
  }

  fetchMore() {
    this.page++;

    this.postService.newsFeed(this.user.id, this.page, 10).subscribe(values => {
      values.rows.forEach(row => {
        this.posts.push({post: row, showMore: false, height: 0});
      })

      setTimeout(() => {
        this.setHeights();
      }, 500);
    })
  }

  setHeights() {
    this.posts.forEach(p => {
      if(p.post.text) {
        p.height = document.getElementById("panelText-" + p.post.id)?.offsetHeight!;
      }
    });

    this.changeDetector.detectChanges();
  }

  sanitizerText(text: string) {
    return this.sanitizer.bypassSecurityTrustHtml(text);
  }

  unfollow(user: User) {
    var follower = {follower: this.user, followerId: this.user.id, followed: user, followedId: user.id};

    this.followerService.unfollow(follower).subscribe(result => {
      if(result) {
        this.onUnfollow.emit(follower);
      }
    })
  }
}
