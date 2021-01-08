import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import firebase from 'firebase/app'
import '@firebase/auth';
import { take, map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private itemDoc: AngularFirestoreDocument<any>;
  item: Observable<any>;
  itemsCollection: any;
  
  constructor(public afAuth: AngularFireAuth, public afs: AngularFirestore,private _router: Router) { }
  
  //Authentication methods
  getConfig() {
    return environment.social;
  }
  
  login(loginType){
    let loginMethod;
    if(loginType == 'FB'){loginMethod = new firebase.auth.FacebookAuthProvider();}
    if(loginType == 'GOOGLE'){loginMethod = new firebase.auth.GoogleAuthProvider();}
    return this.afAuth.signInWithRedirect(loginMethod);
  }
  
  logout(){
    return this.afAuth.signOut();
  }
  
  redirectLogin(){
    return this.afAuth.getRedirectResult();
  }
  
  isUserLoggedin(): Observable<boolean | UrlTree>{
    return this.afAuth.authState.pipe(
      take(1),
      map(state => !!state),
      (authenticated => { return authenticated }));
    }
    
    getUser(): Promise<any> {
    return this.afAuth.authState.pipe(take(1)).toPromise();
  }
  
  isUserAdmin(){
    let collUrl: string = !this.isUserLoggedin()? "abcd": firebase.auth().currentUser.uid;
    collUrl = "/Onlinestore/storemanagement/admins/" + collUrl;
    console.log(collUrl);
    return this.getDoc(collUrl);
  }

  getDocs(coll: string, filters?:any) {
    this.itemsCollection = this.afs.collection<any>(this.getCollectionUrl(coll));
    return this.itemsCollection.valueChanges();
  }
  
  getDoc(collUrl: string){
    this.itemDoc = this.afs.doc<any>(collUrl);
    return this.itemDoc.valueChanges();
  }

  setDocs(coll: string, data: any, docId?: any){
    const id = this.afs.createId();
    const item = {id, name};
    const timestamp = this.timestamp;
    var docRef = this.afs.collection(this.getCollectionUrl(coll)).doc(item.id);
    return docRef.set({
      ...data,
      _id: id,
      updatedAt:timestamp,
      createdAt:timestamp,
      delete_flag:"N",
      userId: firebase.auth().currentUser.uid,
      userName: firebase.auth().currentUser.displayName,
      userEmail: firebase.auth().currentUser.email
    });
  }
  
  updateDocs(coll: string, data: any, docId?: any){
    const id = this.afs.createId();
    const item = {id, name};
    const timestamp = this.timestamp;
    var docRef = this.afs.collection(this.getCollectionUrl(coll)).doc(data._id);
    return docRef.update({
      ...data,
      _id: id,
      updatedAt:timestamp,
      userId: firebase.auth().currentUser.uid,
      userName: firebase.auth().currentUser.displayName,
      userEmail: firebase.auth().currentUser.email
    });
  }

  get timestamp(){
    var d = new Date();
    return d;
  }
  
  getCollectionUrl(filter){
    return "/Onlinestore/storemanagement/"+filter;
  }  
  
    
  
  getOneDoc(collType, docID) {
    console.log("lvl-2");
    let docUrl = this.getCollectionUrl(collType)+"/"+docID;
    console.log(docUrl);
    this.itemDoc = this.afs.doc<any>(docUrl);
    console.log(this.itemDoc);
    return this.itemDoc.valueChanges(); 
  }  

  setProductPic(filePath, coll, docId?){
    var docRef = this.afs.collection(coll).doc(docId);
    return docRef.set({
        path: filePath
    },{merge: true});
}

  deleteProductPic(coll, docId?){
    var docRef = this.afs.collection(coll).doc(docId);
    return docRef.set({
        path: null
    },{merge: true});
  }
  
  

    //Fake methods
  getFilterProducts(collType, filters) {
    let fakeresponse = [{
      'category': "Fakeresponse",
      'scategory': "Slippers",
      'name': "Flip-flops",
      'price': "12",
      '_id': "212E"
    }];
    return Observable.create(
      observer => {
        setTimeout(() => {
          observer.next(fakeresponse)
        }, 3000);
      }
    )
  }

  getCartTotal() {
    let fakeresponse = '10';
    return Observable.create(
      observer => {
        setTimeout(() => {
          observer.next(fakeresponse)
        }, 3000);
      }
    )
  }

  getUserStatus() {
    let fakeresponse = true;
    return Observable.create(
      observer => {
        setTimeout(() => {
          observer.next(fakeresponse)
        }, 3000)
      }
    )
  }

  setProducts(collType, formData) {
    let fakeresponse = true;
    return Observable.create(
      observer => {
        setTimeout(() => {
          observer.next(fakeresponse)
        }, 3000)
      }
    )
  }

  updateProducts(collType, formData) {
    let fakeresponse = true;
    return Observable.create(
      observer => {
        setTimeout(() => {
          observer.next(fakeresponse)
        }, 3000)
      }
    )
  }

  updateShoppingInterest(collType, data) {
    let fakeresponse = true;
    return Observable.create(
      observer => {
        setTimeout(() => {
          observer.next(fakeresponse)
        }, 3000)
      }
    )
  }

  updateShoppingCart(collType, data) {
    let fakeresponse = true;
    return Observable.create(
      observer => {
        setTimeout(() => {
          observer.next(fakeresponse)
        }, 1)
      }
    )
  }


  delOneProductsDoc(collType, docID) {
    let fakeresponse = [{
      'category': "Footwear",
      'scategory': "Slippers",
      'name': "Flip-flops",
      'price': "12",
      '_id': "212E"
    }];
    return Observable.create(
      observer => {
        setTimeout(() => {
          observer.next(fakeresponse)
        }, 3000)
      }
    )
  }

}
