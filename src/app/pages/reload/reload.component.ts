import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { User } from '../../models/user.model';
import { environment } from '../../../environments/environment';
import { City } from '../../models/city.model';
import { RequestCopyright } from '../../models/request-copyright.model';

@Component({
  selector: 'app-reload',
  templateUrl: './reload.component.html',
  styleUrls: ['./reload.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule,
  ]
})
export class ReloadComponent {

  constructor(public router: Router) { }

   reloadComponent(self: boolean, urlToNavigateTo?: string) {
     const url = self ? this.router.url : urlToNavigateTo;
     
     if(url?.startsWith("http")) {
       window.open(url, "_blank");
     }
     else {
       this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
         this.router.navigate([`/${url}`]).then(() => {
         })
       })
     }
  }

  openProfile(user: User) {
    this.reloadComponent(false, "/" + user.username);
  }

  reloadPage() {
    window.location.reload()
  }

  homePage() {
    window.location.href = environment.origin;
  }

  getName(user: User) {
    if(user) {
      return user.type == 'Company' ? user.company!.name : user.person!.name + " " + user.person!.surname;
    }
    else {
      return "";
    }
  }

  getLocation(city: City) {
    if(city) {
      return city.name + ', ' + city.state.name + ", " + city.state.country.name;
    }
    else {
      return "";
    }
  }

  getProfilePicture(user: User) {
    if(user) {
      return environment.serverOrigin + "/files/users/" + user.id + "/profile.png";
    }
    return "";
  }

  getProfilePictureId(userId: number) {
    return environment.serverOrigin + "/files/users/" + userId + "/profile.png";
  }

  visitProfile(user: User, event: Event | null = null) {
    if(event) { 
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();
    }
    this.openProfile(user);
  }

  getRequestUrl(request: RequestCopyright) {
    return environment.origin + "/endorse/" + request.id
  }

  getUserUrl(user: User) {
    return environment.origin + "/" + user.username
  }

  getUsername(user: User) {
    return user ? user.username : "";
  }

  getProfessionCategory(user: User) {
    if(user) {
      return user.type == 'Company' ? user.company!.industry?.name : user.person!.profession;
    }
    else {
      return "";
    }
  }
}
