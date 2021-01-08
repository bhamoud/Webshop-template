import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { BackendService } from './backend.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{


  constructor(public afAuth: AngularFireAuth, public _router: Router, public backendService: BackendService) { }
  

  canActivate(): Observable<boolean | UrlTree> {
    return this.afAuth.authState.pipe(
      take(1),
      map(state => state? true: this._router.navigate[('/login')]));
  }
}
