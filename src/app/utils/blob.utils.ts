export class BlobUtils {
    static b64toBlob(b64Data: any, contentType = '', sliceSize = 512) {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        
        return blob;
    }

    static b64toBlobPart(b64Data: any, sliceSize = 512) {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return byteArrays;
    }


    static cropImage(imgUri: string, width = 450, height = 800, xstart = 0, ystart = 0, callback: Function) {
        try {
            let resize_canvas = document.createElement('canvas');
            let orig_src = new Image();
            orig_src.src = imgUri;
            orig_src.onload = function () {
                resize_canvas.width = width;
                resize_canvas.height = height;
                let cnv: any = resize_canvas.getContext('2d');
                cnv.drawImage(orig_src, xstart, ystart, width, height, 0, 0, width, height);
                let newimgUri = resize_canvas.toDataURL("image/png").toString();
                callback(newimgUri);
            }
        }
        catch (e) {
            callback(imgUri);
        }
    }
}