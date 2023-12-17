import { Endorse } from "./endorse.model";
import { MediaChannel } from "./media-channel.model";

export class EndorseMediaChannel {
    id: number;
    endorseId: number;
    mediaChannelId: number;

    mediaChannel: MediaChannel;
    endorse: Endorse;
}