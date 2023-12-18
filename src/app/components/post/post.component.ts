import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
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
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
  posts: Array<Post> = [];
  loading: boolean = true;
  page: number = 1;

  constructor(public override router:Router, private postService: PostService, private sanitizer: DomSanitizer) {
    super(router)
  }

  ngOnChanges(): void {
    this.loading = false;

    this.postService.newsFeed(this.user.id, 1, 10).subscribe(values => {
      this.posts = values.rows.reverse();
    })
  }

  fetchMore() {
    this.page++;

    this.postService.newsFeed(this.user.id, this.page, 10).subscribe(values => {
      values.rows.reverse().forEach(row => {
        this.posts.unshift(row);
      })
    })
  }

  getName(user: User) {
    return user.type=='Company' ? user.company!.name : user.person!.name + " " + user.person!.surname;
  }

  getProfilePicture(user: User) {
    return environment.serverOrigin + "/files/users/" + user.id + "/profile.png";
  }

  visitProfile(user: User) {
    this.reloadComponent(false, '/' + user.id);
  }

  transformHtml(htmlTextWithStyle: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(htmlTextWithStyle);
  }
}
