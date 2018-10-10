import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatDuration'
})
export class FormatDurationPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        return this.toHHMMSS(value);
    }

    toHHMMSS = function (seconds) {

        let date = new Date(null);
        date.setSeconds(seconds);
        return date.toISOString().substr(11,8);
    }


}
