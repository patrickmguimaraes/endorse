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
import {MatTooltipModule} from '@angular/material/tooltip';
import { Endorse } from '../../models/endorse';

export class Panel {
  post: Post;
  powered: boolean;
  powers: number;
  viewed: boolean;
  endorsed: boolean;
  endorse?: Endorse;

  constructor(endorse: Endorse, powered: boolean, endorsed: boolean) {
    this.post = endorse.post;
    this.powered = powered;
    this.powers = 0;
    this.endorse = endorse;
    this.endorsed = endorsed;
    this.viewed = false;
  }
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
    DatePipe,
    MatTooltipModule,
  ]
})
export class PostComponent extends ReloadComponent implements OnChanges {
  @Input("panel") panel: Panel;
  @Input("user") user: User;
  @Output("onEndorse") onEndorse: EventEmitter<Panel> = new EventEmitter<Panel>();
  @Output("onUnfollow") onUnfollow: EventEmitter<Follower> = new EventEmitter<Follower>();
  @Input("showButtons") showButtons: boolean = true;

  constructor(public override router: Router, private postService: PostService, private sanitizer: DomSanitizer, private changeDetector: ChangeDetectorRef,
    private followerService: FollowerService, private snack: SnackbarService) {
    super(router);
  }

  ngOnChanges(): void {
    
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

  openEndorse() {
    this.onEndorse.emit(this.panel);
  }

  unpower(panel: Panel) {
    panel.powered = false;

    this.postService.unpower(this.user.id, panel.post.id).subscribe(p => {
      panel.powers = p.powers;
    })
  }
}
