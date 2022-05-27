import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, Subscription } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { fallIn, moveIn } from '../../shared/router.animations';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  animations: [moveIn(), fallIn()],
  host: { '[@moveIn]': '' }
})
export class ProductComponent implements OnInit {

  toggle: boolean = true;
  savedChanges = false;
  error: boolean = false;
  errorMessage: String = "";
  dataloading: boolean = false;
  private querySubscription: Subscription;
  members: Observable<any>[];
  profileUrl: any;
  counter: number;
  myDocData: any;

  // profileUrl: Observable<string | null>;

  constructor(private _backendService: BackendService, private _storage: AngularFireStorage) { }

  ngOnInit() {
    this.getData();
  }

  getFilterData(filters) {
    this.dataloading = true;
    /*this.querySubscription = this._backendService.getFilterDocs('products', filters)
      .then((members) => {
        this.members = members;
        this.dataloading = false;
      },
        (error) => {
          this.error = true;
          this.errorMessage = error.message;
          this.dataloading = false;
        },
        () => { this.error = false; this.dataloading = false; });*/
  }

  getData() {
    this.dataloading = true;
    this.querySubscription = this._backendService.getDocs('products')
      .subscribe(members => {
        this.members = members;
        this.dataloading = false;
      },
        (error) => {
          this.error = true;
          this.errorMessage = error.message;
          this.dataloading = false;
        },
        () => { this.error = false; this.dataloading = false; });
  }

  getPic(picId){
    const ref = this._storage.ref(picId);
    this.profileUrl = ref.getDownloadURL();
}

  showDetail(item) {
    this.counter = 0;
    this.myDocData = item;
    this.getPic(item.path);
    // capture user interest event, user looked into product details.
    this.dataloading = true;
    let data = item;

    this.querySubscription = this._backendService.updateShoppingInterest("interests", data)
      .subscribe(members => {
        this.members = members;
        this.dataloading = false;
      },
        (error) => {
          this.error = true;
          this.errorMessage = error.message;
          this.dataloading = false;
        },
        () => { this.error = false; this.dataloading = false; });
  }

  countProd(filter) {
    if (filter == 'add') {
      this.counter = this.counter + 1;
    }
    else {
      if (this.counter > 0) {
        this.counter = this.counter - 1;
      }
    }

  }

  addToCart(item, counter) {
    this.dataloading = true;
    let data = item;
    data.qty = counter;
    return this._backendService.updateShoppingCart("carts", data).then((success) => {
      console.log(success);
      this.dataloading = false;
      this.counter = 0;
      this.savedChanges = true;
    });
  }

}
