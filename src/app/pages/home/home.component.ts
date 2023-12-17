import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { AuthenticationService } from '../../services/authentication.service';
import { EndorseService } from '../../services/endorse.service';
import { environment } from '../../../environments/environment';
import { ReloadComponent } from '../reload/reload.component';
import { FollowComponent } from '../../components/follow/follow.component';
import { PostComponent } from '../../components/post/post.component';
import { NewPostComponent } from '../../components/new-post/new-post.component';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ImagePipe } from '../../pipes/image.pipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule,
    ImagePipe, 
    FollowComponent, 
    PostComponent, 
    NewPostComponent
  ]
})
export class HomeComponent extends ReloadComponent implements OnInit {
  user: User = new User();
  profilePicture: string = environment.serverOrigin + "/files/users/" + this.user.id + "/profile.png";
  
  
  constructor(public override router:Router, private authService: AuthenticationService, private endorseService: EndorseService, private cdref: ChangeDetectorRef) { 
      super(router);
      //this.loadScripts();
  }

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if(user) {
        this.user = user;
      }
    })

    this.authService.getUserPicture().subscribe(userPic => {
      this.profilePicture = environment.serverOrigin + "/files/users/undefined/profile.png";
      this.cdref.detectChanges();
      this.profilePicture = userPic;
      this.cdref.detectChanges();
    })
  }
  
  loadScripts() {
    const dynamicScripts = [
      "assets/assets2/libs/nouislider/nouislider.min.js",
      "assets/assets2/libs/wnumb/wNumb.min.js",
      "assets/assets2/js/products.js"];

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

  getName() {
    return this.user.type=='Company' ? this.user.company!.name : this.user.person!.name + " " + this.user.person!.surname;
  }

  getProfessionIndustry() {
    return this.user.type=='Company' ? this.user.company!.category?.name : this.user.person!.profession;
  }
}
