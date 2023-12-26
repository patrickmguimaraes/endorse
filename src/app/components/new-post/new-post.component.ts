import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Post } from '../../models/post';
import { User } from '../../models/user.model';
import { PostService } from '../../services/post.service';
import { StorageService } from '../../services/storage.service';
import { environment } from '../../../environments/environment';
import { Camera, CameraResultType } from '@capacitor/camera';
import { BlobUtils } from '../../utils/blob.utils';
import { QuillEditorComponent, QuillModule, provideQuillConfig } from 'ngx-quill';
import { AuthenticationService } from '../../services/authentication.service';
import { SnackbarService } from '../../utils/snackbar.service';
import Quill from 'quill';
import { ImagePipe } from '../../pipes/image.pipe';
import { ReloadComponent } from '../../pages/reload/reload.component';
import { Router } from '@angular/router';
import { Article } from '../../models/article';
import { Idea } from '../../models/idea';
import * as FileModel from '../../models/file.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ImagePipe,
    QuillModule,
    DatePipe,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatButtonModule,
    MatExpansionModule,
  ]
})
export class NewPostComponent extends ReloadComponent implements OnChanges {
  @Input("asHeaderButton") asHeaderButton : boolean = false;
  @Input("user") user: User;
  loading: boolean = true;
  @ViewChild('quill') quill: QuillEditorComponent;
  text?: string;
  video?: string;
  photo: string;
  showCamera: boolean = false;
  name: string = "";
  image?: string;
  article: boolean = false;
  title?: string;
  author?: string;
  subject?: string;
  date: Date;
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],
      ['clean'], // remove formatting button
    ]
  };

  constructor(public override router:Router, private authService: AuthenticationService, private changeDetector : ChangeDetectorRef, private postService: PostService, private storageService: StorageService,
    private snack: SnackbarService) {
      super(router);
      this.loadScripts();
  }

  ngOnChanges(): void {
    this.authService.getUserPicture().subscribe(userPic => {
      this.photo = environment.serverOrigin + "/files/users/undefined/profile.png";
      this.changeDetector.detectChanges();
      this.photo = userPic;
      this.changeDetector.detectChanges();
      this.clean();
    })

    this.loading = false;
  }

  sendPost() {
    var post: Post = new Post();
    post.date = new Date();
    post.userId = this.user.id;
    post.powers = 0;
    post.endorsements = 0;
    post.status = "Posted";
    post.link = this.name;

    if(this.article) {
      var article = new Article();
      article.text = this.text;
      article.title = this.title;
      article.author = this.author;
      article.subject = this.subject;
      article.date = new Date();
      post.article = article;
    }
    else {
      var idea = new Idea();
      idea.text = this.text;
      post.idea = idea;
    }

    post.files = [];

    if(this.image) {
      var file: FileModel.File = new FileModel.File();
      file.path = this.image;
      file.type = "png";
      post.files.push(file);
    }

    if(this.video) {
      var file = new FileModel.File();
      file.path = this.video;
      file.type = "mp4";
      post.files.push(file);
    }

    this.postService.create(post).subscribe(value => {
      if(value) {
        this.clean(); 
        this.snack.success("Success", "You have just posted!");
        (document.getElementById('btnCloseModal') as HTMLButtonElement)?.click();
        this.postService.addNewPost(value);
      }
    });
  }

  verifyPost() {
    var regex = /(<([^>]+)>)/ig;
    const hasText = !!this.text?.replace(regex, "").length;

    const itens = document.querySelectorAll('.needs-validation');
      
    Array.from(itens).forEach(item => {
      item.classList.add('was-validated')
    })

    this.name = this.name?.replaceAll(" ", "-")
  
    if((this.name && this.name.length>0 && this.name.length<50) && ((this.article && hasText && this.title && this.title.length>5 && this.title.length<=100 && this.author && this.author!="" && this.author.length<=100 && this.subject && this.subject.length>9 && this.subject.length<=200) || (!this.article && this.text && this.text.length>0))) {
      return true;
    }

    return false;
  }

  clean() {
    this.video = undefined;
    this.image = undefined;
    this.article = false;
    this.title = undefined;
    this.subject = undefined;
    this.author = this.getName(this.user);
    this.date = new Date();
    this.text = undefined;

    var quill = this.quill ? this.quill.quillEditor as Quill : null;
    if(quill) {
      quill.deleteText(0, quill.getLength());
      quill.focus();
    }

    this.postService.getPostName(this.user.id).subscribe(value => {
      this.name = value.word;
      this.changeDetector.detectChanges();
    })
  }

  async openCamera() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      correctOrientation: true,
      saveToGallery: true,
    });
  
    if(image) {
      this.video = undefined;
      this.image = undefined;

      var name: string = new Date().getTime() + ".png";
      var fileConverted: File = new File(BlobUtils.b64toBlobPart(image.base64String), name);

      const formData = new FormData();
      formData.append('file', fileConverted);

      this.storageService.savePostImage(formData).subscribe(path => {
        this.image = path.path;
        this.changeDetector.detectChanges();
      });
    }
  }

  removePicture() {
    this.image = undefined;
  }

  loadScripts() {
    const dynamicScripts: any[] = [
    ];

    for (let i = document.getElementsByTagName('script').length-1; i >=0 ; i--) {
      dynamicScripts.forEach(path => {
        if((window.location.origin + "/" + path) == document.getElementsByTagName('script')[i].src) {
          document.getElementsByTagName('head')[0].removeChild(document.getElementsByTagName('script')[i]);
        }
      })
    }

    for (let i = 0; i < dynamicScripts.length; i++) {
      const node = document.createElement('script');
      node.src = dynamicScripts[i];
      node.type = 'text/javascript';
      node.async = false;
      document.getElementsByTagName('head')[0].appendChild(node);
    }
  }

  selectFile(event: any) {
    if(event.target.files.length>0) {
      this.video = undefined;
      this.image = undefined;

      const formData = new FormData();
      formData.append('file', event.target.files[0]);

      this.storageService.savePostVideo(formData).subscribe(path => {
        this.video = path.path;
        this.changeDetector.detectChanges();
      })
    }
  }

  selectFileImage(event: any) {
    if(event.target.files.length>0) {
      this.video = undefined;
      this.image = undefined;

      const formData = new FormData();
      formData.append('file', event.target.files[0]);

      this.storageService.savePostVideo(formData).subscribe(path => {
        this.image = path.path;
        this.changeDetector.detectChanges();
      })
    }
  }

  getFilePath(path: string) {
    return environment.serverOrigin + "/storage/users/" + this.user.id + "/posts/" + path;
  }

  changeToArticle() {
    this.article = true;
  }
}
