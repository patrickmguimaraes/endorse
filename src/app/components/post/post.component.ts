import { CommonModule, DatePipe, SlicePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { ImagePipe } from '../../pipes/image.pipe';
import { Post } from '../../models/post';
import { PostService } from '../../services/post.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
    QuillModule,
    DatePipe
  ]
})
export class PostComponent extends ReloadComponent implements OnChanges {
  @Input("user") user: User;
  @Input("onPost") onPost: EventEmitter<Post>;
  @Output("onUnfollow") onUnfollow: EventEmitter<Follower> = new EventEmitter<Follower>();
  posts: Array<Panel> = [];
  loadingBars: boolean = true;
  page: number = 1;
  getMoreLoading: boolean = false;

  constructor(public override router: Router, private postService: PostService, private sanitizer: DomSanitizer, private changeDetector: ChangeDetectorRef,
    private followerService: FollowerService, private snack: SnackbarService) {
    super(router);
  }

  ngOnChanges(): void {
    this.loadingBars = true;

    this.postService.newsFeed(this.user.id, 1, 10).subscribe(values => {
      values.rows.forEach(r => {
        this.posts.push({ post: r });
      })

      setTimeout(() => {
        this.loadingBars = false;
      }, 500);
    })

    this.onPost.subscribe(post => {
      this.loadingBars = true;

      this.posts.unshift({ post: post });

      setTimeout(() => {
        this.loadingBars = false;
      }, 500);
    })

    setTimeout(() => {
      this.loadingBars = false;
    }, 1000);
  }

  fetchMore() {
    this.page++;

    this.postService.newsFeed(this.user.id, this.page, 10).subscribe(values => {
      setTimeout(() => {
        values.rows.forEach(row => {
          this.posts.push({ post: row });
        })
  
        this.getMoreLoading = false;
      }, 500);
    })
  }

  unfollow(user: User) {
    var follower = { follower: this.user, followerId: this.user.id, followed: user, followedId: user.id };

    this.followerService.unfollow(follower).subscribe(result => {
      if (result) {
        this.onUnfollow.emit(follower);
      }
    })
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;
    
    if (pos == max) {
      this.getMoreLoading = true;
      this.fetchMore();
    }
  }
}
