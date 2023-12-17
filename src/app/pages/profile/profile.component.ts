import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { User } from '../../models/user.model';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { FolderPage } from '../folder/folder.page';
import { ReloadComponent } from '../reload/reload.component';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ImagePipe } from '../../pipes/image.pipe';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule,
    ImagePipe
  ]
})
export class ProfileComponent extends ReloadComponent implements OnInit {
  user: User = new User();
  profilePicture: string;

  constructor(public override router:Router, private authService: AuthenticationService, private userService: UserService, private cdref: ChangeDetectorRef, private folder: FolderPage) {
    super(router);
    //this.loadScripts();
  }

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if(user) {
        this.user = user;
        this.setProfilePicture();
      }
    })
  }

  loadScripts() {
    const dynamicScripts = [
      "assets/assets2/libs/jsvectormap/js/job-candidate-details.js"];

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

  setProfilePicture() {
    this.profilePicture = environment.serverOrigin + "/files/users/undefined/profile.png";
    this.cdref.detectChanges();
    this.profilePicture = environment.serverOrigin + "/files/users/" + this.user.id + "/profile.png";
    this.cdref.detectChanges();
    
    this.authService.setProfilePicture(this.profilePicture);
  }

  selectFile(event: any) {
    if(event.target.files.length>0) {
      
      const formData = new FormData();
      formData.append('sampleFile', event.target.files[0]);

      this.userService.attachProfilePicture(formData, this.user.id).subscribe(src => {
        this.setProfilePicture();
      })
    }
  }
}
