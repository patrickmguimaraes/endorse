import { Request } from "./request.model";
import { MediaChannel } from "./media-channel.model";

export class RequestMediaChannel {
    id: number;
    requestId: number;
    mediaChannelId: number;

    mediaChannel: MediaChannel;
    request: Request;
}