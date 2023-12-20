import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { User } from '../../models/user.model';
import { environment } from '../../../environments/environment';
import { Request } from '../../models/request.model';

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
    //console.log("Current route I am on:",this.router.url);
    const url = self ? this.router.url : urlToNavigateTo;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([`/${url}`]).then(() => {
        //console.log(`After navigation I am on:${this.router.url}`)
      })
    })
  }

  reloadPage() {
    window.location.reload()
  }

  getName(user: User) {
    if(user) {
      return user.type == 'Company' ? user.company!.name : user.person!.name + " " + user.person!.surname;
    }
    else {
      return "";
    }
  }

  getProfilePicture(user: User) {
    return environment.serverOrigin + "/files/users/" + user.id + "/profile.png";
  }

  getProfilePictureId(userId: number) {
    return environment.serverOrigin + "/files/users/" + userId + "/profile.png";
  }

  visitProfile(user: User) {
    this.reloadComponent(false, user.username);
  }

  getRequestUrl(request: Request) {
    return environment.origin + "/endorse/" + request.id
  }

  getUserUrl(user: User) {
    return environment.origin + "/" + user.username
  }

  getUsername(user: User) {
    return user ? user.username : "";
  }
}
