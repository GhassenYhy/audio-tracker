import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatPlayerTime'
})
export class FormatPlayerTimePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        return this.toHHMMSS(value);
    }

    toHHMMSS = function (miliseconds) {

        miliseconds = parseInt(miliseconds, 10); // don't forget the second param
        let secondsInput = miliseconds / 1000;

        var minutes = Math.floor(secondsInput / 60);
        var seconds = secondsInput - (minutes * 60);

        let minutesText = minutes.toString(),
            secondsText = seconds.toFixed(2).toString();

        if (minutes < 10) { minutesText = "0" + minutes; }
        if (seconds < 10) { secondsText = "0" + seconds.toFixed(2).toString(); }

        return minutesText + ':' + secondsText;
    }


}
