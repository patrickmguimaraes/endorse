import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';

@Component({
  selector: 'app-share',
  standalone: true,
  imports: [
    ShareButtonsModule,
    ShareIconsModule,
    FontAwesomeModule
  ],
  templateUrl: './share.component.html',
  styleUrl: './share.component.scss'
})
export class ShareComponent {
  @Input("url") url: string;
  @Input("description") description: string;
  @Input("tags") tags: string;
}
