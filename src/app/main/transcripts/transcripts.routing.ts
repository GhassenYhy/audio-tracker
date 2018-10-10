import { TranscriptsComponent } from './transcripts.component';
import { TranscriptComponent } from './transcript/transcript.component';

export const routes = [
    {
        path: '',
        component: TranscriptsComponent
    },
    {
        path: ':id',
        component: TranscriptComponent
    }
];
