export class Converter {
    static cloneFromForm(object: Object, reference: Object): any {
        var newObject: any = {};

        for (var key in object) {
            for(var keyReference in reference) {
                if(key===keyReference) {
                    var val = (object as any)[key];

                    newObject[key] = val;
                }
            }
        }

        return Object.assign({}, newObject);
    }
}
