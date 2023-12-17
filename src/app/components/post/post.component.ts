import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Endorse } from '../../models/endorse.model';
import { User } from '../../models/user.model';
import { EndorseService } from '../../services/endorse.service';
import { ImagePipe } from '../../pipes/image.pipe';
import { Post } from '../../models/post';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ImagePipe
  ]
})
export class PostComponent  implements OnChanges {
  @Input("user") user: User;
  posts: Array<Post> = [];
  loading: boolean = true;
  page: number = 1;

  constructor(private postService: PostService) { }

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
}
