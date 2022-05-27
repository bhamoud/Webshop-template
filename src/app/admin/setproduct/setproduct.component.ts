import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BackendService } from '../../services/backend.service';
import { AngularFireStorage } from '@angular/fire/storage';
import firebase from 'firebase';
import { DocumentData, QuerySnapshot } from '@angular/fire/firestore';
import { yearsPerPage } from '@angular/material/datepicker';
import { filter } from 'rxjs/operators';


@Component({
    selector: 'set-product',
    templateUrl: './setproduct.component.html',
    styleUrls: ['./setproduct.component.scss']
})

export class SetProductComponent implements OnInit, OnDestroy {

    
    toggleField: string;
    dataSource: MatTableDataSource<any>;
    members: any[];
    myDocData: any;

    savedChanges = false;
    error: boolean = false;
    errorMessage: string = "";
    dataloading: boolean = false;
    private querySubscription;
    db = firebase.firestore();

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    displayedColumns = ['category', 'scategory', 'name', 'price', '_id'];
    profileUrl: any;

    constructor(private _backendService: BackendService, private _storage: AngularFireStorage) { }

    ngOnInit() {
        this.toggleField = "searchMode";
        this.dataSource = new MatTableDataSource(this.members);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    toggle(filter?) {
        if (!filter) { filter = "searchMode" }
        else { filter = filter; }
        this.toggleField = filter;
    }

    // function for data table result view

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    getData() {
        this.dataloading = true;
        this.querySubscription = this._backendService.getDocs('products')
            .subscribe(members => {
                this.members = members;
                this.dataSource = new MatTableDataSource(members);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort
                this.dataloading = false;
            },
                (error) => {
                    this.error = true;
                    this.errorMessage = error.message;
                    this.dataloading = false;
                }, () => { this.error = false; this.dataloading = false; });
    }

    setData(formData) {
        this.dataloading = true;
        this.querySubscription = this._backendService.setDocs('products', formData)
            .then((res) => {
                this.savedChanges = true;
                this.dataloading = false;
            })
            .catch(error => {
                this.error = true;
                this.errorMessage = error.message;
                this.dataloading = false;
            });
    }

    updateData(formData) {
        console.log("updateData")
        this.dataloading = true;
        this.querySubscription = this._backendService.updateDocs('products', formData)
            .then((res) => {
                this.savedChanges = true;
                this.dataloading = false;
            }).catch
            (error => {
                this.error = true;
                this.errorMessage = error.message;
                this.dataloading = false;
            });
    }

    getDoc(docID) {
        this.dataloading = true;
        return this.querySubscription = this._backendService.getOneDoc('products', docID)
            .subscribe(res => {
                if (res) {
                    console.log("lvl-1");
                    this.myDocData = res;
                    this.toggle('editMode');
                    this.dataloading = false;
                }
            },
                (error) => {
                    console.log("lvl-1-error");
                    this.error = true;
                    this.errorMessage = error.message;
                    this.dataloading = false;
                }, () => { this.error = false; this.dataloading = false; });
    }

    deleteDoc(docID) {
        if (confirm("Are you sure you want to delete this record?")) {
            this.dataloading = true;
            this.querySubscription = this._backendService.delOneProductsDoc('products', docID)
                .then(res => {
                    if (res) {
                        this.toggle('searchMode');
                        this.dataloading = false;
                    }
                }).catch
                (error => {
                    this.error = true;
                    this.errorMessage = error.message;
                    this.dataloading = false;
                });
        }
    }

    getPic(picId) {
        const ref = this._storage.ref(picId);
        this.profileUrl = ref.getDownloadURL();
    }


    getFilterData(filters, coll) {
        this.dataloading = true;
        console.log(coll);
        let query;
        query = this._backendService.getQueries(filters, coll)
            .get()
            .then((members) => {
                let i = 0;
                let array = [];
                members.forEach((member) => {
                    array[i] = member.data();
                    i++;
                })
                console.log(array);
                this.dataSource = new MatTableDataSource(array);    
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort
                this.dataloading = false;
            })
            .catch((error) =>{
                this.error = true;
                this.errorMessage = error.Message;
                this.dataloading = false;
            });
    }

    ngOnDestroy() {
        if (this.querySubscription) {
            this.querySubscription.unsubscribe();
        }
    }
}