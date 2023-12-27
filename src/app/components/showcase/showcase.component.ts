import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Panel } from '../post/post.component';
import { environment } from '../../../environments/environment';
import { File } from '../../models/file.model';

@Component({
  selector: 'app-showcase',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './showcase.component.html',
  styleUrl: './showcase.component.scss'
})
export class ShowcaseComponent {
  @Input("panel") panel: Panel;
  @Input("titleCategoryDescription") titleCategoryDescription: boolean = true;
  @Input("implementationPlanTagsChallenges") implementationPlanTagsChallenges: boolean = true;

  getPath(file: File) {
    return environment.serverOrigin + "/storage/users/" + this.panel.post.user.id + "/posts/" +   this.panel.post.id + "/showcase/" + file.path;
  }
}
