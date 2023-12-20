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
  post: Post,
  powered: boolean,
  powers: number,
  viewed: boolean
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
  panels: Array<Panel> = [];
  loadingBars: boolean = true;
  page: number = 1;
  getMoreLoading: boolean = false;

  constructor(public override router: Router, private postService: PostService, private sanitizer: DomSanitizer, private changeDetector: ChangeDetectorRef,
    private followerService: FollowerService, private snack: SnackbarService) {
    super(router);
  }

  ngOnChanges(): void {
    this.loading(true);

    this.postService.newsFeed(this.user.id, 1, 10).subscribe(values => {
      values.rows.forEach(r => {
        this.panels.push({post: r, powered: false, powers: 0, viewed: false});
      })

      this.loading(false);

      setTimeout(() => {
        this.onWindowScroll();
      }, 500);
    })

    this.onPost.subscribe(post => {
      this.loading(true);

      this.panels.unshift({post, powered: false, powers: 0, viewed: false});

      this.loading(false);
    })
  }

  loading(value: boolean) {
    this.loadingBars = value;
  }

  fetchMore() {
    this.page++;

    this.postService.newsFeed(this.user.id, this.page, 10).subscribe(values => {
      setTimeout(() => {
        values.rows.forEach(row => {
          this.panels.push({post: row, powered: false, powers: 0, viewed: false});
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

  power(panel: Panel) {
    panel.powered = true;

    this.postService.power(this.user.id, panel.post.id).subscribe(p => {
      if(p.power) {
        panel.powers = p.powers;
      }
      else {
        panel.powered = false;
      }
    })
  }

  unpower(panel: Panel) {
    panel.powered = false;

    this.postService.unpower(this.user.id, panel.post.id).subscribe(p => {
      if(p.unpower) {
        panel.powers = p.powers;
      }
      else {
        panel.powered = true;
      }
    })
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    let top = (document.documentElement.scrollTop || document.body.scrollTop);
    let pos = top + document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;
    
    if (pos == max) {
      this.getMoreLoading = true;
      this.fetchMore();
    }

    this.panels.forEach(p => {
      if(!p.viewed) {
        var divTop = document.getElementById("post-" + p.post.id)?.offsetTop!;
        var divHeight = document.getElementById("post-" + p.post.id)?.offsetHeight!;
        var div = divTop + divHeight;

        if(div > top && div < pos) {
          this.postService.viewed(this.user.id, p.post.id).subscribe(res => {
            p.viewed = res!=null;
          })
        }
      }
    })
  }
}
