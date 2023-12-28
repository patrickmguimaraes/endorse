import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { ImagePipe } from '../../../../../pipes/image.pipe';
import { ReloadComponent } from '../../../../reload/reload.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../../../../environments/environment';
import { Post } from '../../../../../models/post';
import { User } from '../../../../../models/user.model';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { CategoryService } from '../../../../../services/company.service';
import { PostService } from '../../../../../services/post.service';
import { StorageService } from '../../../../../services/storage.service';
import { TagService } from '../../../../../services/tag.service';
import { SnackbarService } from '../../../../../utils/snackbar.service';
import { Collaboration } from '../../../../../models/collaboration.model';
import { File } from '../../../../../models/file.model';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ENTER, COMMA, TAB } from '@angular/cdk/keycodes';
import { CollaborationTag } from '../../../../../models/collaboration-tag.model';
import { CollaborationCategory } from '../../../../../models/collaboration-category.model';
import {MatTableModule} from '@angular/material/table';
import { ConfirmDialogComponent } from '../../../../../components/confirm-dialog/confirm-dialog.component';
import { CollaborationRequest } from '../../../../../models/collaboration-request.model';

@Component({
  selector: 'app-collaboration',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule,
    ImagePipe, 
    DatePipe,
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
    MatTableModule
  ],
  templateUrl: './collaboration.component.html',
  styleUrl: './collaboration.component.scss'
})
export class CollaborationComponent extends ReloadComponent implements OnInit {
  collaborations: Array<Collaboration>;
  post: Post;
  user: User;
  collaboration: Collaboration = new Collaboration();
  separatorKeysCodes: number[] = [ENTER, COMMA, TAB];
  addOnBlur = true;
  categories: Array<CollaborationCategory> = [];
  displayedColumns: string[] = ['title', 'vacacies', 'salary', 'deadline', 'edit', 'applications', 'delete'];
  displayedColumnsApplication: string[] = ['contact', 'openCV', 'decline', 'apply'];
  dateFormat: string;
  minDate: Date = new Date();
  collaborationApplication: Collaboration;

  constructor(public override router:Router, private route: ActivatedRoute, private _adapter: DateAdapter<Date>, private postService: PostService,
    private titleService: Title, private snack: SnackbarService, private cdref: ChangeDetectorRef, public dialog: MatDialog, private authService: AuthenticationService, private tagService: TagService) {
    super(router);

    this.postService.getAllCollaborationCategories().subscribe(categories => {
      this.categories = categories;
    })

    this._adapter.setLocale(this.authService.getSessao().language + "-" + this.authService.getSessao().country);
    this.dateFormat = this.authService.getSessao().dateFormat;
  }

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if(user) {
        this.user = user;

        if(this.route.parent?.snapshot.params['postId']) {
          this.postService.getPost(this.user.id, this.route.parent?.snapshot.params['postId']).subscribe(value => {
            if(value && value.userId==this.user.id) {
              this.post = value;

              if(this.post.collaborations) { 
                this.collaborations = this.post.collaborations; 
              }
              else { 
                this.collaborations = [];
              }
    
              this.cdref.detectChanges();
              
              this.titleService.setTitle("Endorse an Idea - " + this.getName(this.post.user) + " - " + this.post.link + " - Collaboration");
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
    })
  }

  add() {
    this.collaboration.postId = this.post.id;

    this.postService.saveCollaboration(this.collaboration).subscribe(collaboration => {
      if(collaboration) {
        if(!this.collaboration.id) { this.snack.success("Success", "You have just added a new collaboration"); }
        else { this.snack.success("Success", "You have just saved a collaboration"); }
        
        this.collaboration = new Collaboration();
        this.ngOnInit();
      }
    })
  }

  delete(collaboration: Collaboration) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: "delete"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.postService.deleteCollaboration(collaboration).subscribe(collaboration => {
          if(collaboration) {
            this.collaboration = new Collaboration();
            this.snack.success("Success", "You have just deleted the collaboration.");
            this.ngOnInit();
          }
        })
      }
    });
  }

  selectCollaboration(collaboration: Collaboration) {
    this.collaboration = collaboration;
  }

  validate() {
    if(!this.collaboration.title || this.collaboration.title.length==0) { return true; }
    if(!this.collaboration.collaborationCategoryId || this.collaboration.collaborationCategoryId>0==false) { return true; }
    if(!this.collaboration.description || this.collaboration.description.length==0) { return true; }
    if(!this.collaboration.workingExperience || this.collaboration.workingExperience.length==0) { return true; }
    if(!this.collaboration.vacacies || this.collaboration.vacacies<=0) { return true; }
    if(!this.collaboration.salary || this.collaboration.salary.length==0) { return true; }
    if(!this.collaboration.deadline) { return true; }
    if(!this.collaboration.skills || this.collaboration.skills.length==0) { return true; }

    return false;
  }

  removeTag(tag: CollaborationTag, index: number) {
    if(tag.collaborationId) {
      this.postService.deleteCollaborationSkill(tag).subscribe(result => {
        if(result) {
          this.collaboration.skills.splice(index, 1);
          this.cdref.detectChanges();
        }
      })
    }
    else {
      this.collaboration.skills.splice(index, 1);
      this.cdref.detectChanges();
    }
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    var tagFound: boolean = false;

    if(value!="") {
      this.collaboration.skills.forEach(t => {
        if(t.tag.name==value.toLowerCase()) {
          tagFound = true;
        }
      })
  
      if(!tagFound) {
        this.tagService.findOrCreate(value).subscribe(tag => {
          if(tag) {
            var skill = new CollaborationTag();
            skill.originalTag = value;
            skill.tagId = tag.id;
            skill.tag = tag;
  
            if(this.collaboration.id) {
              skill.collaborationId = this.collaboration.id;
  
              this.postService.addCollaborationSkill(skill).subscribe(result => {
                if(result) {
                  result.tag = tag;
                  this.collaboration.skills.push(result);
                }
              })
            }
            else {
              this.collaboration.skills.push(skill);
            }
          }
        })
      }
    }
    
    event.chipInput!.clear();
  }

  openApplications(item: Collaboration) {
    this.collaborationApplication = item;
  }

  getCVPath(request: CollaborationRequest) {
    return environment.serverOrigin + "/storage/users/" + this.post.user.id + "/posts/" + this.post.id + "/collaboration/" + request.collaborationId + "/" + request.file.path;
  }

  changeStatus(request: CollaborationRequest, status: "Approved" | "Rejected" | "Reviewing") {
    this.snack.loading = true;
    this.postService.changeCollaborationRequestStatus(request.id, status).subscribe(req => {
      if(req) {
        request.status = status;
        this.cdref.detectChanges();
      }

      this.snack.loading = false;
    })
  }
}
