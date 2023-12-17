import { Component, OnInit } from '@angular/core';
import { EndorseHistory } from '../../models/endorse-history.model';
import { Endorse } from '../../models/endorse.model';
import { User } from '../../models/user.model';
import { AuthenticationService } from '../../services/authentication.service';
import { EndorseHistoryService } from '../../services/endorse.service';
import { environment } from '../../../environments/environment';
import { ReloadComponent } from '../reload/reload.component';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { ImagePipe } from '../../pipes/image.pipe';

class Timeline {
  year: number;
  mounth: number;
  date: Date;
  history: Array<EndorseHistory> = [];
}

@Component({
  standalone: true,
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  imports: [
    CommonModule, 
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule,
    ImagePipe,
    DatePipe
  ]
})
export class TimelineComponent extends ReloadComponent implements OnInit {
  user: User = new User();
  timeline: Array<Timeline> = [];
  first: Date;
  last: Date;

  constructor(public override router:Router, private historyService: EndorseHistoryService, private authService: AuthenticationService) { 
    super(router);
  }

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if(user) {
        this.user = user;
        this.historyService.mountMyHistory(this.user.id).subscribe(history => {
          this.timeline = [];

          history.forEach(h => {
            var founded: Timeline | null= null;

            this.timeline.forEach(t => {
              if(new Date(h.date).getFullYear()==t.year && new Date(h.date).getMonth()==t.mounth) {
                founded = t;
              }
            });

            if(founded==null) { 
              founded = new Timeline();
              founded.year = new Date(h.date).getFullYear();
              founded.mounth = new Date(h.date).getMonth();
              founded.date = new Date(founded.year, founded.mounth, 1);
              this.timeline.push(founded);
            }
             
            founded.history.push(h);
          });
          
          this.timeline.sort((a, b) => b.year-a.year);
          this.timeline.forEach(t => {
            t.history.sort((a, b) => new Date(b.date).getTime()-new Date(a.date).getTime())
          });

          if(this.timeline.length==0) {
            this.first = new Date();
            this.last = new Date(new Date().getTime() + 2592000000);
          }
        })
      }
    })
  }

  getName(user: User) {
    return this.user.type=='Company' ? this.user.company!.name : this.user.person!.name + " " + this.user.person!.surname;
  }

  getPicture(user: User) {
    return environment.serverOrigin + "/files/users/" + user.id + "/profile.png";
  }

  getEndorseUrl(endorse: Endorse) {
    return environment.origin + "/endorse/" + endorse.id
  }

  getUserUrl(user: User) {
    return environment.origin + "/" + user.username
  }
}
