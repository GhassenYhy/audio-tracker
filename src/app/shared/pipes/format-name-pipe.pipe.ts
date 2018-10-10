import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatNamePipe'
})
export class FormatNamePipePipe implements PipeTransform {

    transform(value: any, args?: any): any {

        let speaker = value.split("_");
        speaker = speaker.map(item => item.replace(/(^|\s)\S/g, l => l.toUpperCase()));

        let speakerString = speaker.join(" ");

        return speakerString;
    }

}
