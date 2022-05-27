import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-admincarts',
  templateUrl: './admincarts.component.html',
  styleUrls: ['./admincarts.component.scss']
})

export class AdmincartsComponent implements OnInit, OnDestroy {


    toggleField: string;
    dataSource: MatTableDataSource<any>;
    members: any[];
    myDocData: any;

    savedChanges = false;
    error: boolean = false;
    errorMessage: string = "";
    dataloading: boolean = false;
    private querySubscription;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    displayedColumns = ['category', 'scategory', 'name', 'price', '_id'];

    constructor(private _backendService: BackendService) { }

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

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLocaleLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getData() {
        this.dataloading = true;
        this.querySubscription = this._backendService.getDocs('cart')
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
        this.querySubscription = this._backendService.setProducts('cart', formData)
            .subscribe(members => {
                if (members) {
                    this.savedChanges = true;
                    this.dataloading = false;
                }
            },
                (error) => {
                    this.error = true;
                    this.errorMessage = error.message;
                    this.dataloading = false;
                }, () => { this.error = false; this.dataloading = false; });
    }

    updateData(formData) {
        this.dataloading = true;
        this.querySubscription = this._backendService.updateProducts('cart', formData)
            .subscribe(members => {
                if (members) {
                    this.savedChanges = true;
                    this.dataloading = false;
                }
            },
                (error) => {
                    this.error = true;
                    this.errorMessage = error.message;
                    this.dataloading = false;
                }, () => { this.error = false; this.dataloading = false; });
    }

    getDoc(docID) {
        this.dataloading = true;
        this.querySubscription = this._backendService.getOneDoc('cart', docID)
            .subscribe(res => {
                if (res) {
                    this.myDocData = res;
                    this.toggle('editMode');
                    this.dataloading = false;
                }
            },
                (error) => {
                    this.error = true;
                    this.errorMessage = error.message;
                    this.dataloading = false;
                }, () => { this.error = false; this.dataloading = false; });
    }

    deleteDoc(docID) {
        if (confirm("Are you sure you want to delete this record?")) {
            this.dataloading = true;
            this.querySubscription = this._backendService.delOneProductsDoc('carts', docID)
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
    getFilterData(filters) {
        this.dataloading = true;
        this.querySubscription = this._backendService.getFilterDocs('cart', filters)
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

    ngOnDestroy() {
        if (this.querySubscription) {
            this.querySubscription.unsubscribe();
        }
    }
}