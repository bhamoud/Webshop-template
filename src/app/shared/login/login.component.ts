import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { BackendService } from 'src/app/services/backend.service';
import firebase from 'firebase/app'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userloggedin: boolean = true;
  error: boolean = false;
  errorMessage: String = "";
  dataLoading: boolean = false;

  constructor(public afAuth: AngularFireAuth, private _backendService: BackendService) { }

  ngOnInit() {
    this.getAuthStatus();
  }

  login(loginType, formData?) {
    this.dataLoading = true;
    if (formData) {
      firebase.auth().signInWithEmailAndPassword(formData.email, formData.password).catch((error) => {
        console.log(error);

        this.error = true;
        this.errorMessage = error.message;
        this.userloggedin = false;
        this.dataLoading = false;
      });
    }
    else {
      this._backendService.login(loginType);
    }
  }

  logout() {
    this.dataLoading = true;
    this._backendService.logout().then((success) => {
      this.userloggedin = false;
      this.dataLoading = false;
    });
  }

  getAuthStatus() {
    this.dataLoading = true;
    this._backendService.redirectLogin().then((result) => {
      if (result) {
        this.dataLoading = false;
        this.userloggedin = true;
      }
    });

  }

}
