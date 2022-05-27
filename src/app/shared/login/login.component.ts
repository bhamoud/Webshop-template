import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { BackendService } from 'src/app/services/backend.service';
import firebase from 'firebase/app'
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user: any;
  userloggedin: boolean = true;
  error: boolean = false;
  register: boolean = false;
  errorMessage: String = "";
  dataloading: boolean = false;
  private querySubscription;
  savedChanges: boolean;
  myDocData: any;
  toggleField: any;

  constructor(public afAuth: AngularFireAuth, private _backendService: BackendService, private _router: Router) { }

  ngOnInit() {
    this.getAuthStatus();
  }

  toggle(filter?) {
    if (!filter) { filter = "login" }
    else { filter = filter; }
    this.toggleField = filter;
  }
  login(loginType, formData?) {
    this.dataloading = true;
    if (formData) {
      firebase.auth().signInWithEmailAndPassword(formData.email, formData.password)
        .then(()=> {
          this.dataloading = false;
        })
        .catch((error) => {
          console.log(error);
          this.error = true;
          this.errorMessage = error.message;
          this.userloggedin = false;
          this.dataloading = false;
        });
    }
    else {
      this._backendService.login(loginType);
    }
  }

  logout() {
    this.dataloading = true;
    this._backendService.logout().then((success) => {
      this.userloggedin = false;
      this.dataloading = false;
    });
  }

  getAuthStatus() {
    this.dataloading = true;
    this._backendService.redirectLogin().then((result) => {
      if (result) {
        this.dataloading = false;
        this.userloggedin = true;
      }
    });
  }

  goToAddAccount(){
    console.log('add account')
    this._router.parseUrl('/register');
  }
}
