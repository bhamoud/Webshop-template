import { Component,Input } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.scss']
})

export class FileUploadComponent {
    @Input() fileUrl: string;
    @Input() docId: string;
    task: AngularFireUploadTask;
    percentage: Observable<number>;
    snapshot: Observable<any>;
    downloadURL: Observable<string>;
    isHovering: boolean;
    error: boolean = false;

    constructor(private _storage: AngularFireStorage, private _backEndService: BackendService) { }

    toggleHover(event: boolean) {
        this.isHovering = event;
    }

    startUpload(event: any) {
        const file = event.item(0);
        if (file.type.split('/')[0] !== 'image') {
            this.error = true;
            console.log('unsupporterd file type');
            return;
        } else {
            this.error = false;
        }
        const filePath = '/Onlinestore/storemanagement/products/' + localStorage.getItem('center') + '/' + this.fileUrl + '/' + new Date().getTime();
        const fileRef = this._storage.ref(filePath);
        const task = this._storage.upload(filePath, file);
        this.percentage = task.percentageChanges();

        this.task = this._storage.upload(filePath, file);
        this.percentage = this.task.percentageChanges();
        this.task.snapshotChanges().pipe(
            finalize(() => {
                //this.downloadURL = fileRef.getDownloadURL();
                return this._backEndService.setProductPic(filePath, this.fileUrl, this.docId);
            })
        ).subscribe();
    }

    isActive(snapshot) {
        return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
    }
}