import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true,
  pure: true
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    if (value) {
      var agoOrNot = "ago";

      var seconds = Math.floor((+new Date() - +new Date(value)) / 1000);

      if(seconds<0) { 
        seconds = seconds * -1;
        agoOrNot = "";
      }

      if (seconds < 29) // less than 30 seconds ago will show as 'Just now'
        return 'Just now';
      const intervals: any = {
        'year': 31536000,
        'month': 2592000,
        'week': 604800,
        'day': 86400,
        'hour': 3600,
        'minute': 60,
        'second': 1
      };
      let counter;
      for (const i in intervals) {
        counter = Math.floor(seconds / intervals[i]);
      
        if (counter > 0)
          if (counter === 1) {
            return counter + ' ' + i + ' ' + agoOrNot; // singular (1 day ago)
          } else {
            return counter + ' ' + i + 's ' + agoOrNot; // plural (2 days ago)
          }
      }
    }
    return value;
  }
}
