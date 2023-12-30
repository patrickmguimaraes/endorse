import { RequestCopyright } from "./request-copyright.model";
import { MediaChannel } from "./media-channel.model";

export class RequestCopyrightMediaChannel {
    id: number;
    requestId: number;
    mediaChannelId: number;

    mediaChannel: MediaChannel;
    request: RequestCopyright;
}