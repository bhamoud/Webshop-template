import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss']
})
export class AddAccountComponent implements OnInit {

  dataloading: boolean = false;
  error: boolean = false;
  errorMessage: string;
  private querySubscription;
  savedChanges: boolean = false;

  constructor(private _backendService: BackendService) { }

  ngOnInit(): void {
  }

  setData(formData) {
    this.dataloading = true;
    console.log(formData.email);
    console.log(formData.password);
    this._backendService.setUser(formData)
      .then((user) => {
        console.log("registry succeeded of " + user);
      })
      .catch((error) => {
        this.errorMessage = error.message;
        this.dataloading = false;
        return this.error = true;
        ;
      });
    this.querySubscription = this._backendService.setUserDocs('users', formData)
      .then(() => {
        this.savedChanges = true;
        this.dataloading = false;
      })
      .catch(error => {
        this.error = true;
        this.errorMessage = error.message;
        this.dataloading = false;
      });
  }

}
