import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

export const mimeType = (control: AbstractControl): Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {
  if (typeof(control.value) === 'string') {
    return of(null);
  }

  const file = control.value as File;
  const reader = new FileReader();
  const readerObservable = Observable.create((observer: Observer<{[key: string]: any}>) => {
    reader.addEventListener("loadend", () => {
      const array = new Uint8Array(<ArrayBuffer>reader.result).subarray(0, 4);
      let header: string = "";
      let isValid: boolean = false;

      for (let i = 0; i < array.length; i++) {
        header += array[i].toString(16);
      }

      switch (header) {
        case "89504e47":
          isValid = true;
          break;
        case "ffd8ffe0":
        case "ffd8ffe1":
        case "ffd8ffe2":
        case "ffd8ffe3":
        case "ffd8ffe8":
          isValid = true;
          break;
        default:
          isValid = false;
          break;
      }
      if (isValid) {
        observer.next(null);
      } else {
        observer.next({ invalidMimeType: true });
      }
      observer.complete();
    });

    reader.readAsArrayBuffer(file);
  });

  return readerObservable;
}
