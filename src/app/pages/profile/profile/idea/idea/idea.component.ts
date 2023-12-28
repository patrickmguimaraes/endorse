import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReloadComponent } from '../../../../reload/reload.component';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { FollowerService } from '../../../../../services/follower.service';
import { UserService } from '../../../../../services/user.service';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { User } from '../../../../../models/user.model';
import { PostService } from '../../../../../services/post.service';
import { Post } from '../../../../../models/post';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ImagePipe } from '../../../../../pipes/image.pipe';
import { Panel, PostComponent } from '../../../../../components/post/post.component';
import { TimelineComponent } from '../timeline/timeline.component';
import { DiscussionsComponent } from '../discussions/discussions.component';
import { CopyrightComponent } from '../copyright/copyright.component';
import { CollaborationComponent } from '../collaboration/collaboration.component';
import { Title } from '@angular/platform-browser';
import { HeaderComponent } from '../../../../../components/header/header.component';
import { ShowcaseComponent } from '../../../../../components/showcase/showcase.component';
import { MatTableModule } from '@angular/material/table';
import { Collaboration } from '../../../../../models/collaboration.model';
import { MatButtonModule } from '@angular/material/button';

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
    CopyrightComponent,
    CollaborationComponent,
    HeaderComponent,
    ShowcaseComponent,
    MatTableModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './idea.component.html',
  styleUrl: './idea.component.scss'
})
export class IdeaComponent extends ReloadComponent implements OnInit, AfterViewInit {
  user: User;
  post: Post;
  panel: Panel;
  loadingBars: boolean = true;
  height: number = 460;
  profile: User;
  showcaseHeight?: number;
  displayedColumns: string[] = ['title', 'vacacies', 'salary', 'deadline', 'view'];
  dateFormat: string;

  constructor(public override router:Router, private authService: AuthenticationService, private cdref: ChangeDetectorRef,
    private route: ActivatedRoute, private postService: PostService, private titleService: Title, private userService: UserService) { 
      super(router);

      this.dateFormat = this.authService.getSessao().dateFormat;
  }

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if(user) {
        this.user = user;

          if (this.route.parent?.parent?.snapshot.params['userId']) {
            this.userService.findByUsername(this.route.parent?.parent?.snapshot.params['userId']).subscribe(value => {
              if (value) {
                this.profile = value;
                
                if(this.route.snapshot.params['postId']) {
                  this.postService.getPost(this.profile.id, this.route.snapshot.params['postId']).subscribe(value => {
                    if(value) {
                      this.post = value;
                      this.postService.poweredAndEndorsed(this.user.id, this.post.id!).subscribe(result => {
                        this.panel = {post: this.post, powers: this.post.powers, endorsements: this.post.endorsements, powered: result.power!=null, endorsed: result.endorse!=null};
                        
                        this.loadingBars = false;
                        
                        this.cdref.detectChanges();
                      })
        
                      this.titleService.setTitle("Endorse an Idea - " + this.getName(this.post.user) + " - " + this.post.link);
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
    })
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.cdref.detectChanges();
      this.showcaseHeight = document.getElementById("showcasePanel")?.offsetHeight;
      this.cdref.detectChanges();
    }, 150);
  }
}
