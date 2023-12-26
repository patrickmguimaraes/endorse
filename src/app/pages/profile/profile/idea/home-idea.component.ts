import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../../components/header/header.component';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../../../services/authentication.service';
import { PostService } from '../../../../services/post.service';
import { User } from '../../../../models/user.model';
import { Post } from '../../../../models/post';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-home-idea',
  standalone: true,
  imports: [
    RouterModule,
    HeaderComponent
  ],
  templateUrl: './home-idea.component.html',
  styleUrl: './home-idea.component.scss'
})
export class HomeIdeaComponent {
  user: User;
  post: Post;
  profile: User;
  waitFinished: boolean = false;

  constructor(public router: Router, private authService: AuthenticationService, private cdref: ChangeDetectorRef,
    private userService: UserService, private route: ActivatedRoute, private postService: PostService) {
  }

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.user = user;

        this.route.parent?.params.subscribe(param => {
          if (param['userId']) {
            this.userService.findByUsername(param['userId']).subscribe(value => {
              if (value) {
                this.profile = value;

                if (this.route.snapshot.params['postId']) {
                  this.postService.getPost(this.profile.id, this.route.snapshot.params['postId']).subscribe(value => {
                    if (value) {
                      this.post = value;
                    }
                    else {
                      this.router.navigate(["/page-not-found"]);
                    }
                  })
                }
                else {
                  this.router.navigate(["/page-not-found"]);
                }
              }
              else {
                this.router.navigate(["/page-not-found"]);
              }
            })
          }
          else {
            this.router.navigate(["/"]);
          }
        })
      }
    })
  }
}
