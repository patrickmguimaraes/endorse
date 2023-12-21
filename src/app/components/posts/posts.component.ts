import { CommonModule, DatePipe, NgTemplateOutlet, SlicePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
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
import { Panel, PostComponent } from '../post/post.component';
import { Endorse } from '../../models/endorse';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ImagePipe,
    MatProgressSpinnerModule,
    TimeAgoPipe,
    QuillModule,
    DatePipe,
    PostComponent
  ]
})
export class PostsComponent extends ReloadComponent implements OnChanges {
  @Input("user") user: User;
  @Input("onPost") onPost: EventEmitter<Post>;
  @Output("onUnfollow") onUnfollow: EventEmitter<Follower> = new EventEmitter<Follower>();
  panels: Array<Panel> = [];
  loadingBars: boolean = true;
  getMoreLoading: boolean = false;
  selectedPanel?: Panel;
  endorsementText?: string;

  constructor(public override router: Router, private postService: PostService, private sanitizer: DomSanitizer, private changeDetector: ChangeDetectorRef,
    private followerService: FollowerService, private snack: SnackbarService) {
    super(router);
  }

  ngOnChanges(): void {
    this.loading(true);

    this.fetchNewsFeed();

    this.onPost.subscribe(post => {
      this.loading(true);

      this.panels.unshift({post, powered: false, powers: post.powers, viewed: false, endorsed: false});

      this.loading(false);
    })
  }

  loading(value: boolean) {
    this.loadingBars = value;
  }

  fetchNewsFeed() {
    this.postService.newsFeed(this.user.id).subscribe(values => {
      var temp: Array<Panel> = [];

      if(values.posts && values.posts.rows) {
        values.posts.rows.forEach(row => {
          temp.push({post: row, powered: false, powers: row.powers, viewed: false, endorsed: false});
        })
      }

      if(values.endorsements && values.endorsements.rows.length>0) {
        values.endorsements.rows.forEach((row, index) => {
          this.postService.poweredAndEndorsed(this.user.id, row.postId!).subscribe(result => {
            temp.push(new Panel(row, result.power!=null, result.endorse!=null));
            
            if(index==values.endorsements.rows.length-1) {
              this.finishFetchNewsFeed(temp);
            }
          })
        });
      }
      else {
        this.finishFetchNewsFeed(temp);
      }
    })
  }

  finishFetchNewsFeed(temp: Array<Panel>) {
    console.log("aqui", temp)
    temp.sort((a, b) => new Date(b.post.date).getTime() - new Date(a.post.date).getTime())

    this.panels.push(...temp);
    
    this.getMoreLoading = false;
    this.changeDetector.detectChanges();
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

  openEndorse(panel: Panel) {
    this.selectedPanel = panel;
    document.getElementById("openEndorseModal")?.click();
  }

  clean() {
    this.selectedPanel = undefined;
    this.endorsementText = undefined;
  }

  endorse() {
    if(this.selectedPanel) {
      var endorse: Endorse = new Endorse();
      endorse.postId = this.selectedPanel?.post.id;
      endorse.userId = this.user.id;
      endorse.text = this.endorsementText;
      endorse.status = "Posted";
      endorse.date = new Date();
      this.selectedPanel.endorsed = true;
  
      this.postService.endorse(endorse).subscribe(value => {
        if(value) {
          this.snack.success("", "You have just endorsed an idea!");
          document.getElementById("btnCloseEndorseModal")?.click();
        }
        else if(this.selectedPanel) {
          this.selectedPanel.endorsed = false;
        }
      })
    }
  }
}
