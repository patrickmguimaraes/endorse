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
import {MatTooltipModule} from '@angular/material/tooltip';
import { Endorse } from '../../models/endorse';
import { AuthenticationService } from '../../services/authentication.service';
import { environment } from '../../../environments/environment';
import { File } from '../../models/file.model';

export class Panel {
  post: Post;
  powered: boolean;
  powers: number;
  viewed?: boolean;
  endorsed: boolean;
  endorse?: Endorse;
  endorsements?: number;

  constructor(endorse: Endorse, powered: boolean, endorsed: boolean) {
    this.post = endorse.post;
    this.powered = powered;
    this.powers = endorse.post.powers;
    this.endorsements = endorse.post.endorsements;
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
    RouterModule,
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
  @Output("onUnfollow") onUnfollow: EventEmitter<Follower> = new EventEmitter<Follower>();
  @Input("showButtons") showButtons: boolean = true;
  @Input("showPanelDetail") showPanelDetail: boolean = false;
  @Input("articleReadingMore") articleReadingMore: boolean = true;
  @ViewChild("bigAnchor") bigAnchor: ElementRef;
  selectedPanel?: Panel;
  endorsementText?: string;
  me: User;
  
  constructor(public override router: Router, private postService: PostService, private sanitizer: DomSanitizer, private changeDetector: ChangeDetectorRef,
    private followerService: FollowerService, private snack: SnackbarService, private authService: AuthenticationService) {
    super(router);
  }

  ngOnChanges(): void {
    this.authService.getUser().subscribe(user => {
      if(user) { this.me = user; }
    })
  }

  unfollow(user: User) {
    var follower = { follower: this.me, followerId: this.me.id, followed: user, followedId: user.id };

    this.followerService.unfollow(follower).subscribe(result => {
      if (result) {
        this.onUnfollow.emit(follower);
      }
    })
  }

  power(event: Event, panel: Panel) {
    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();
    
    panel.powered = true;
    panel.powers = panel.powers + 1;

    this.postService.power(this.me.id, panel.post.id).subscribe(p => {
      if(p.power) {
        panel.powers = p.powers;
      }
      else {
        panel.powered = false;
      }
    })
  }

  unpower(event: Event, panel: Panel) {
    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();

    panel.powered = false;
    panel.powers = panel.powers - 1;

    this.postService.unpower(this.me.id, panel.post.id).subscribe(p => {
      panel.powers = p.powers;
    })
  }

  openEndorse(event: Event, panel: Panel) {
    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();

    this.selectedPanel = panel;

    setTimeout(() => {
      document.getElementById("openEndorseModal")?.click();
      this.selectedPanel = panel;
    }, 500);
  }

  prevent(event: Event) {
    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();
  }

  clean() {
    this.selectedPanel = undefined;
    this.endorsementText = undefined;
  }

  endorse() {
    if(this.selectedPanel) {
      var endorse: Endorse = new Endorse();
      endorse.postId = this.selectedPanel?.post.id;
      endorse.userId = this.me.id;
      endorse.text = this.endorsementText;
      endorse.status = "Posted";
      endorse.date = new Date();
      this.selectedPanel.endorsed = true;
      this.selectedPanel.endorsements = (this.selectedPanel.endorsements ? this.selectedPanel.endorsements : 0) + 1;

      this.postService.endorse(endorse).subscribe(value => {
        if(value) {
          this.snack.success("", "You have just endorsed an idea!");
          document.getElementById("btnCloseEndorseModal")?.click();
        }
        else if(this.selectedPanel) {
          this.selectedPanel.endorsed = false;
          this.selectedPanel.endorsements = (this.selectedPanel.endorsements ? this.selectedPanel.endorsements : 0) - 1;
        }
      })
    }
  }

  getFilePath(file: File) {
    if(file && file.path) {
      return environment.serverOrigin + "/storage/users/" + this.user.id + "/posts/" + this.panel.post.id + "/" + file.path;
    }
    else {
      return "";
    }
  }
}
