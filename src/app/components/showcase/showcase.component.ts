import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterOutlet } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { ImagePipe } from '../../pipes/image.pipe';
import { CategoryService } from '../../services/company.service';
import { Category } from '../../models/category.model';
import { Showcase } from '../../models/showcase';
import { FileService } from '../../services/file.service';
import { File } from '../../models/file.model';
import { environment } from '../../../environments/environment';
import { Post } from '../../models/post';

@Component({
  selector: 'app-showcase',
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
  ],
  templateUrl: './showcase.component.html',
  styleUrl: './showcase.component.scss'
})
export class ShowcaseComponent implements OnInit {
  categories: Array<Category> = [];
  @Input("post") post: Post;
  @Input("showcase") showcase: Showcase = new Showcase();
  fileName?: string;

  constructor(private categoryService: CategoryService, private fileService: FileService) {
    
  }

  ngOnInit() {
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories;
    })
  }

  selectFileAttachment(event: any) {
    if(event.target.files.length>0) {
      const formData = new FormData();
      formData.append('sampleFile', event.target.files[0]);

      this.fileService.attachShowcaseFile(formData, this.post.id).subscribe(src => {
        var file: File = new File();
        file.name = this.fileName ? this.fileName : src.name;
        file.path = environment.serverOrigin + "/files/showcase/" +  this.post.id + "/" + src.name;
        if(!this.showcase.files) { this.showcase.files = []; }
        this.showcase.files.push(file);

        this.fileName = undefined;
      })
    }
  }

  onRemoveFile(ev: any, i: any) {
    if (ev.detail.role == "confirm") {
      this.showcase.files.splice(i, 1)
    }
  }
}
