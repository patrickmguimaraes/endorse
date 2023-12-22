import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReloadComponent } from '../reload/reload.component';
import { AuthenticationService } from '../../services/authentication.service';
import { FollowerService } from '../../services/follower.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { User } from '../../models/user.model';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ImagePipe } from '../../pipes/image.pipe';
import { Panel, PostComponent } from '../../components/post/post.component';
import { TimelineComponent } from '../../components/timeline/timeline.component';
import { DiscussionsComponent } from '../../components/discussions/discussions.component';
import { ShowcaseComponent } from '../../components/showcase/showcase.component';
import { CopyrightComponent } from '../../components/copyright/copyright.component';
import { CollaborationComponent } from '../../components/collaboration/collaboration.component';

@Component({
  selector: 'app-idea',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule,
    ImagePipe,
    PostComponent,
    TimelineComponent,
    DiscussionsComponent,
    ShowcaseComponent,
    CopyrightComponent,
    CollaborationComponent
  ],
  templateUrl: './idea.component.html',
  styleUrl: './idea.component.scss'
})
export class IdeaComponent extends ReloadComponent implements OnInit {
  user: User;
  post: Post;
  panel: Panel;
  loadingBars: boolean = true;
  height: number = 460;
  
  constructor(public override router:Router, private authService: AuthenticationService, private cdref: ChangeDetectorRef,
    private route: ActivatedRoute, private postService: PostService) { 
      super(router);
  }

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if(user) {
        this.user = user;

        if(this.route.snapshot.params['code']) {
          this.postService.getPost(this.route.snapshot.params['code']).subscribe(value => {
            if(value) {
              this.post = value;
              this.postService.poweredAndEndorsed(this.user.id, this.post.id!).subscribe(result => {
                this.panel = {post: this.post, powers: this.post.powers, endorsements: this.post.endorsements, powered: result.power!=null, endorsed: result.endorse!=null};
                
                this.loadingBars = false;
                this.cdref.detectChanges();
              })
            }
            else {
              this.router.navigate(["page-not-found"]);
            }
          })
        }
        else {
          this.router.navigate(["page-not-found"]);
        }
      }
    })
  }
}
