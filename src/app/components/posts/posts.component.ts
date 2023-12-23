import { CommonModule, DatePipe, NgTemplateOutlet, SlicePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { ImagePipe } from '../../pipes/image.pipe';
import { Post } from '../../models/post';
import { PostService } from '../../services/post.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReloadComponent } from '../../pages/reload/reload.component';
import { Router, RouterModule } from '@angular/router';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { QuillModule } from 'ngx-quill';
import { DomSanitizer } from '@angular/platform-browser';
import { FollowerService } from '../../services/follower.service';
import { SnackbarService } from '../../utils/snackbar.service';
import { Follower } from '../../models/follower';
import { Panel, PostComponent } from '../post/post.component';
import { Endorse } from '../../models/endorse';
import { OrdinalPipe } from '../../pipes/ordinal.pipe';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ImagePipe,
    MatProgressSpinnerModule,
    TimeAgoPipe,
    QuillModule,
    DatePipe,
    PostComponent,
    OrdinalPipe
  ]
})
export class PostsComponent extends ReloadComponent implements OnChanges {
  @Input("user") user: User;
  @Input("onPost") onPost: EventEmitter<Post>;
  @Output("onUnfollow") onUnfollow: EventEmitter<Follower> = new EventEmitter<Follower>();
  panels: Array<Panel> = [];
  loadingBars: boolean = true;
  getMoreLoading: boolean = false;
  detail?: Panel;

  constructor(public override router: Router, private postService: PostService, private sanitizer: DomSanitizer, private changeDetector: ChangeDetectorRef,
    private followerService: FollowerService, private snack: SnackbarService) {
    super(router);
  }

  ngOnChanges(): void {
    this.fetchNewsFeed();

    this.onPost.subscribe(post => {
      this.loading(true);

      this.panels.unshift({post, powered: false, powers: post.powers, endorsements: post.endorsements, viewed: false, endorsed: false});

      this.loading(false);
    })
  }

  loading(value: boolean) {
    this.loadingBars = value;
    this.changeDetector.detectChanges();
  }

  fetchNewsFeed() {
    this.loading(true);

    this.postService.newsFeed(this.user.id).subscribe(values => {
      var temp: Array<Panel> = [];
      var twoArrays: Array<any> = [...values.posts.rows, ...values.endorsements.rows];

      if(twoArrays && twoArrays.length > 0) {
        twoArrays.forEach((row, index) => {
          if(!row.post) {
            this.postService.poweredAndEndorsed(this.user.id, row.id).subscribe(result => {
              temp.push({post: row, powered: result.power!=null, powers: row.powers, endorsements: row.endorsements, viewed: false, endorsed: result.endorse!=null});
              
              if(index==twoArrays.length-1) {
                this.finishFetchNewsFeed(temp);
              }
            })
          }
          else {
            this.postService.poweredAndEndorsed(this.user.id, row.post.id).subscribe(result => {
              temp.push(new Panel(row, result.power!=null, result.endorse!=null));
              
              if(index==twoArrays.length-1) {
                this.finishFetchNewsFeed(temp);
              }
            })
          }
        })
      }
      else {
        this.finishFetchNewsFeed(temp);
      }
    })
  }

  async finishFetchNewsFeed(temp: Array<Panel>) {
    temp.sort((a, b) => {
      var dateA = new Date(a.endorse ? a.endorse.date! : a.post.date);
      var dateB = new Date(b.endorse ? b.endorse.date! : b.post.date);

      return dateB.getTime() - dateA.getTime()
    })

    this.panels.push(...temp);
    
    this.getMoreLoading = false;
    this.loading(false);
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
      panel.powers = p.powers;
    })
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    let top = (document.documentElement.scrollTop || document.body.scrollTop);
    let pos = top + document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;
    
    if (!this.getMoreLoading && pos == max) {
      this.getMoreLoading = true;
      this.fetchNewsFeed();
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
