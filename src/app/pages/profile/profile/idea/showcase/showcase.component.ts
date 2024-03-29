import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { ImagePipe } from '../../../../../pipes/image.pipe';
import { CategoryService } from '../../../../../services/company.service';
import { Category } from '../../../../../models/category.model';
import { Showcase } from '../../../../../models/showcase';
import { File } from '../../../../../models/file.model';
import { environment } from '../../../../../../environments/environment';
import { Post } from '../../../../../models/post';
import { PostService } from '../../../../../services/post.service';
import { ReloadComponent } from '../../../../reload/reload.component';
import { Title } from '@angular/platform-browser';
import { SnackbarService } from '../../../../../utils/snackbar.service';
import { StorageService } from '../../../../../services/storage.service';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../../components/confirm-dialog/confirm-dialog.component';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { User } from '../../../../../models/user.model';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import { ShowcaseTag } from '../../../../../models/showcase-tag';
import {COMMA, ENTER, TAB} from '@angular/cdk/keycodes';
import { TagService } from '../../../../../services/tag.service';

@Component({
  selector: 'app-showcase-page',
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
  ],
  templateUrl: './showcase.component.html',
  styleUrl: './showcase.component.scss'
})
export class ShowcaseComponent extends ReloadComponent implements OnInit {
  categories: Array<Category> = [];
  showcase: Showcase;
  post: Post;
  user: User;
  separatorKeysCodes: number[] = [ENTER, COMMA, TAB];
  addOnBlur = true;

  constructor(public override router:Router, private route: ActivatedRoute, private categoryService: CategoryService, private fileService: StorageService, private postService: PostService,
    private titleService: Title, private snack: SnackbarService, private cdref: ChangeDetectorRef, public dialog: MatDialog, private authService: AuthenticationService, private tagService: TagService) {
    super(router);
  }

  ngOnInit() {
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories;
    })

    this.authService.getUser().subscribe(user => {
      if(user) {
        this.user = user;

        if(this.route.parent?.snapshot.params['postId']) {
          this.postService.getPost(this.user.id, this.route.parent?.snapshot.params['postId']).subscribe(value => {
            if(value && value.userId==this.user.id) {
              this.post = value;
              if(this.post.showcase) { this.showcase = this.post.showcase; }
              else { this.showcase = new Showcase(); }
    
              this.cdref.detectChanges();
              
              this.titleService.setTitle("Endorse an Idea - " + this.getName(this.post.user) + " - " + this.post.link + " - Idea Showcase");
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

  save() {
    this.showcase.postId = this.post.id;

    this.postService.saveShowcase(this.showcase).subscribe(showcase => {
      this.snack.success("Success", "You just saved your Idea Showcase");
      this.ngOnInit();
    })
  }

  selectFileAttachment(event: any) {
    if(event.target.files.length>0) {
      const formData = new FormData();
      formData.append('file', event.target.files[0]);

      this.fileService.attachShowcaseFile(formData, this.post.id, this.showcase.id).subscribe(src => {
        if(!this.showcase.files) { this.showcase.files = []; }

        if(src.path) {
          var file: File = new File();
          file.userId = this.user.id;
          file.path = src.path;
          file.name = src.path;
          file.type = src.path.substring((src.path as string).lastIndexOf(".") + 1);
          this.showcase.files.push(file);
        }
        else {
          
          this.showcase.files.push(src);
        }

        this.cdref.detectChanges();
      })
    }
  }

  onRemoveFile(ev: any, i: any) {
    if (ev.detail.role == "confirm") {
      this.showcase.files.splice(i, 1)
    }
  }

  getPath(file: File) {
    return environment.serverOrigin + "/storage/users/" + this.user.id + "/posts/" +  this.post.id + "/showcase/" + file.path;
  }

  deleteFile(file: File) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: "delete"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.showcase.postId = this.post.id;

        this.fileService.deleteShowcaseFile(this.showcase, file).subscribe(result => {
          if(result) {
            this.showcase.files.splice(this.showcase.files.indexOf(file), 1);
            this.cdref.detectChanges();
          }
        })
      }
    });
  }

  removeTag(tag: ShowcaseTag, index: number) {
    if(tag.showcaseId) {
      this.postService.deleteShowcaseTag(tag).subscribe(result => {
        if(result) {
          this.showcase.tags.splice(index, 1);
          this.cdref.detectChanges();
        }
      })
    }
    else {
      this.showcase.tags.splice(index, 1);
      this.cdref.detectChanges();
    }
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    var tagFound: boolean = false;

    if(value!="") {
      this.showcase.tags.forEach(t => {
        if(t.tag.name==value.toLowerCase()) {
          tagFound = true;
        }
      })
  
      if(!tagFound) {
        this.tagService.findOrCreate(value).subscribe(tag => {
          if(tag) {
            var showcaseTag = new ShowcaseTag();
            showcaseTag.originalTag = value;
            showcaseTag.tagId = tag.id;
            showcaseTag.tag = tag;
  
            if(this.showcase.id) {
              showcaseTag.showcaseId = this.showcase.id;
  
              this.postService.addTag(showcaseTag).subscribe(result => {
                if(result) {
                  result.tag = tag;
                  this.showcase.tags.push(result);
                }
              })
            }
            else {
              this.showcase.tags.push(showcaseTag);
            }
          }
        })
      }
    }
    
    event.chipInput!.clear();
  }
}