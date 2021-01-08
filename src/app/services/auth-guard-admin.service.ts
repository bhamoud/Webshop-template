import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BackendService } from './backend.service';
import { map, take,tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardAdminService implements CanActivate{

  constructor(private _backendService: BackendService,private _router: Router) { }

  canActivate(): Observable<boolean> {
    return this._backendService.isUserAdmin().pipe(
      take(1),
      tap(res => console.log(res)),
      map(res => res = res? res.isadmin: false),
      tap(res => console.log(res.isadmin))      
      );
  }
}
