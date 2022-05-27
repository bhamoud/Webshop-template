import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-adminusers',
  templateUrl: './adminusers.component.html',
  styleUrls: ['./adminusers.component.scss']
})
export class AdminusersComponent implements OnInit, OnDestroy {


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
  displayedColumns = ['userId', 'name', 'email', '_id'];
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

  applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLocaleLowerCase();

      if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
      }
  }

  getData() {
      this.dataloading = true;
      this.querySubscription = this._backendService.getDocs('users')
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

  updateData(formData) {
      this.dataloading = true;
      this.querySubscription = this._backendService.updateDocs('users', formData)
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
      console.log("clicked getDoc");
      this.dataloading = true;
      this.querySubscription = this._backendService.getOneDoc('users', docID)
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
          this.querySubscription = this._backendService.delOneProductsDoc('users', docID)
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

  getPic(picId){
      const ref = this._storage.ref(picId);
      this.profileUrl = ref.getDownloadURL();
  }

  getFilterData(filters) {
      this.dataloading = true;
      this.querySubscription = this._backendService.getFilterDocs('users', filters)
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