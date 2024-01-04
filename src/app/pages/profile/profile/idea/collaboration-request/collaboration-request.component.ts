import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { Post } from '../../../../../models/post';
import { User } from '../../../../../models/user.model';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { PostService } from '../../../../../services/post.service';
import { TagService } from '../../../../../services/tag.service';
import { SnackbarService } from '../../../../../utils/snackbar.service';
import { ReloadComponent } from '../../../../reload/reload.component';
import { Collaboration } from '../../../../../models/collaboration.model';
import { CommonModule, DatePipe, AsyncPipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ToastrModule } from 'ngx-toastr';
import { ImagePipe } from '../../../../../pipes/image.pipe';
import { File } from '../../../../../models/file.model';
import { environment } from '../../../../../../environments/environment';
import { TimeAgoPipe } from '../../../../../pipes/time-ago.pipe';
import { ShareComponent } from '../../../../../components/share/share.component';
import { CollaborationRequest } from '../../../../../models/collaboration-request.model';
import { StorageService } from '../../../../../services/storage.service';
import { UserService } from '../../../../../services/user.service';

@Component({
  selector: 'app-collaboration-request',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule,
    ImagePipe, 
    DatePipe,
    TimeAgoPipe,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatButtonModule,
    MatExpansionModule,
    MatDialogModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatTableModule,
    RouterModule,
    ShareComponent
  ],
  templateUrl: './collaboration-request.component.html',
  styleUrl: './collaboration-request.component.scss'
})
export class CollaborationRequestComponent extends ReloadComponent implements OnInit {
  post: Post;
  user: User;
  dateFormat: string;
  collaboration: Collaboration;
  profile: User;
  similar: Array<Collaboration> = [];
  newIdeas: Array<Post> = [];
  application: CollaborationRequest = new CollaborationRequest();

  constructor(public override router:Router, private route: ActivatedRoute, private _adapter: DateAdapter<Date>, private postService: PostService, private storageService: StorageService,
    private titleService: Title, private snack: SnackbarService, private userService: UserService, private cdref: ChangeDetectorRef, public dialog: MatDialog, private authService: AuthenticationService, private tagService: TagService) {
    super(router);
    
    this.dateFormat = this.authService.getSessao().dateFormat;
    this._adapter.setLocale(this.authService.getSessao().language + "-" + this.authService.getSessao().country);
  }

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if(user) {
        this.user = user;

        if (this.route.parent?.parent?.snapshot.params['userId']) {
          this.userService.findByUsername(this.route.parent?.parent?.snapshot.params['userId']).subscribe(value => {
            if (value) {
              this.profile = value;
              if(this.route.parent?.snapshot.params['postId']) {
                this.postService.getPost(this.profile.id, this.route.parent?.snapshot.params['postId']).subscribe(value => {
                  
                  this.post = value;
                  
                  this.post.collaborations.forEach(c => {
                    if(c.id==this.route.snapshot.params['id']) {
                      this.collaboration = c;

                      this.collaboration.description = this.collaboration.description.replace('\n','<br />');
                      this.collaboration.workingExperience = this.collaboration.workingExperience.replace('\n','<br />')

                      this.collaboration.requests.forEach(request => {
                        if(request.userId==this.user.id) {
                          this.application = request;
                          this.cdref.detectChanges();
                        }
                      })

                      this.postService.similarCollaborations(this.collaboration.id, this.collaboration.collaborationCategoryId).subscribe(similar => {
                        this.similar = similar;
                        this.cdref.detectChanges();
                      })

                      this.postService.newsFeed(this.user.id, 1, false).subscribe(values => {
                        this.newIdeas = values;
                        this.cdref.detectChanges();
                      });
                    }
                  })

                  if(!this.collaboration) {
                    this.router.navigate(["/page-not-found"]);
                  }
        
                  this.cdref.detectChanges();
                  
                  this.titleService.setTitle("Endorse an Idea - " + this.getName(this.post.user) + " - " + this.post.link + " - Collaboration Request");
                })
              }
              else {
                this.router.navigate(["/page-not-found"]);
              }
            }
          })
        }
      }
    })
  }

  getImage(files: File[]) {
    var path = "";

    files.forEach(file => {
      if(file.type=="png") { path = file.path.startsWith("http") ? file.path : environment.serverOrigin + "/storage/users/" + this.profile.id + "/posts/" + this.post.id + "/" + file.path; }
    })
    
    return path;
  }

  apply() {
    this.application.userId = this.user.id;
    this.application.collaborationId = this.collaboration.id;
    this.application.date = new Date();

    this.postService.applyCollaboration(this.application).subscribe(application => {
      if(application) {
        this.application = application;
        this.snack.success("Congratulations", "You have just applied for this collaboration!")
        document.getElementById("btnCloseModalApplication")?.click();
        this.cdref.detectChanges();
      }
    })
  }

  openCollaboration(item: Collaboration) {
    this.reloadComponent(false, '/' + item.post.user.username + '/' + item.post.link + '/collaboration-request/' + item.id);
  }

  openIdea(item: Post) {
    this.reloadComponent(false, '/' + item.user.username);
  }

  selectCV(event: any) {
    if(event.target.files.length>0) {
      const formData = new FormData();
      formData.append('file', event.target.files[0]);

      this.storageService.saveCurriculum(formData, this.post.id, this.collaboration.id).subscribe(path => {
        if(path) {
          this.application.file = new File();
          this.application.file.type = "pdf";
          this.application.file.path = path.path;
          this.cdref.detectChanges();
        }
      });
    }
  }

  canApply() {
    return this.collaboration && new Date(this.collaboration.deadline).getTime()>new Date().getTime();
  }
}
