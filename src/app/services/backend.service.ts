import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import firebase from 'firebase/app'
import { take, map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private itemDoc: AngularFirestoreDocument<any>;
  item: Observable<any>;
  itemsCollection: any;
  db: any;
  hasShoppingcart: boolean;
  
  constructor(private cookieService: CookieService, public afAuth: AngularFireAuth, public afs: AngularFirestore,private _router: Router) { 
    this.db = firebase.firestore();
  }
  
  //#region Authentication methods

  //Get environmet social configuration
  getConfig() {
    return environment.social;
  }
  
  //Login to website using either facebook or google
  login(loginType){
    let loginMethod;
    if(loginType == 'FB'){ loginMethod = new firebase.auth.FacebookAuthProvider(); }
    if(loginType == 'GOOGLE'){ loginMethod = new firebase.auth.GoogleAuthProvider(); }
    return this.afAuth.signInWithRedirect(loginMethod);
  }
  
  //Logout from website
  logout(){
    return this.afAuth.signOut();
  }
  
  //Redirect the user after login on different page
  redirectLogin(){
    return this.afAuth.getRedirectResult();
  }
  
  //Checks whether user is logged in or not
  isUserLoggedin(): Observable<boolean | UrlTree>{
    return this.afAuth.authState.pipe(
      take(1),
      map(state => !!state),
      (authenticated => { return authenticated }));
  }
  
  //Gets the user and returns a promise
  getUser(): Promise<any> {
    return this.afAuth.authState.pipe(take(1)).toPromise();
  }
  
  //Check whether the user is an admin
  isUserAdmin(){
    let collUrl: string = !this.isUserLoggedin()? "abcd": firebase.auth().currentUser.uid;
    collUrl = "/Onlinestore/storemanagement/admins/" + collUrl;
    return this.getDoc(collUrl);
  }
  //#endregion

  //#region Database methods

  //Retrieves all documents from a collections
  getDocs(coll: string, filters?:any) {
    this.itemsCollection = this.afs.collection<any>(this.getCollectionUrl(coll));
    return this.itemsCollection.valueChanges();
  }
  
  //Gets one document from a collection
  getDoc(collUrl: string){
    this.itemDoc = this.afs.doc<any>(collUrl);
    return this.itemDoc.valueChanges();
  }

  //Sets a document in a collection
  setDocs(coll: string, data: any, docId?: any){
    const id = this.afs.createId();
    const item = {id, name};
    const timestamp = this.timeStamp();
    var docRef = this.afs.collection(this.getCollectionUrl(coll)).doc(item.id);
    return docRef.set({
      ...data,
      _id: id,
      updatedAt: timestamp,
      createdAt: timestamp,
      delete_flag:"N",
      userId: firebase.auth().currentUser.uid,
      userName: firebase.auth().currentUser.displayName,
      userEmail: firebase.auth().currentUser.email
    });
  }

  //Sets the user info in a collection
  setUserDocs(coll: string, data: any, docId?: any){
    const id = this.afs.createId();
    const item = {id, name};
    const timestamp = this.timeStamp();
    var docRef = this.afs.collection(this.getCollectionUrl(coll)).doc(item.id);
    return docRef.set({
      ...data,
      _id: id,
      updatedAt: timestamp,
      createdAt: timestamp,
      delete_flag:"N",
      userId: firebase.auth().currentUser.uid? firebase.auth().currentUser.uid: id,
    });
  }
  
  //Updates a document in a collection
  updateDocs(coll: string, data: any, docId?: any){
    const id = this.afs.createId();
    const item = {id, name};
    const timestamp = this.timeStamp();
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
  
  //Returns a timestamp
  timeStamp(){
    return firebase.firestore.Timestamp.now();
  }
  
  //Retuns a collection Url
  getCollectionUrl(filter){
    return "/Onlinestore/storemanagement/"+filter;
  }    
  
  //Returns a document from a collection
  getOneDoc(collType, docID) {
    console.log("getOneDoc");
    let docUrl = this.getCollectionUrl(collType)+"/"+docID;
    this.itemDoc = this.afs.doc<any>(docUrl);
    return this.itemDoc.valueChanges(); 
  }  
  
  //Deletes one document from a collection
  delOneProductsDoc(collType, docID) {
    let docUrl = this.getCollectionUrl(collType)+"/"+docID;
    this.itemDoc = this.afs.doc<any>(docUrl);
    return this.itemDoc.delete().then(function(){console.log("Document successfully deleted!"); return true;});
  }
  
  //Sets a picture path for a product document
  setPicData(filePath, coll, docId?){
    var docRef = this.afs.collection(this.getCollectionUrl(coll)).doc(docId);
    return docRef.set({
        path: filePath
    },{merge: true});
  }

  //Deletes the picture from a 
  deletePicData(coll, docId?){
    var docRef = this.afs.collection(coll).doc(docId);
    return docRef.set({
        path: null
    },{merge: true});
  }
  
  //Get documents from a collection with filters applied
  getFilterDocs(coll: string, filters?:any) {
    return this.db.collection(this.getCollectionUrl(coll)).get();
  }

  getQueries(filters, coll){
    let queries;
    let collectionRef = this.db.collection(this.getCollectionUrl(coll));
    filters.category? queries = collectionRef.where('category', '==', filters.category): queries = collectionRef;
    filters.name? queries = queries.where('name', '==', filters.name): console.log('no name submitted');
    filters.fromdt? queries = queries.where('createdAt', '<', filters.fromdt): console.log('no start date submitted');
    filters.todt? queries = queries.where('createdAt', '>', filters.todt): console.log('no end date submitted');
    return queries;
  }
  
  //Creates a new user for login with email and password
  setUser(data){
    return firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
  }
  
  updateShoppingCart(coll, data) {
    var id: any;    
    const timestamp = this.timeStamp();
    var docRef = this.afs.collection(this.getCollectionUrl(coll)).doc(data._id);
    return docRef.update({
      ...data,
      _id: id,
      updatedAt: timestamp,
      userId: firebase.auth().currentUser.uid,
      userName: firebase.auth().currentUser.displayName,
      userEmail: firebase.auth().currentUser.email
    }); 
  }
  
  //#endregion

  //#region Cookie methods

  createCookie(){

  }

  updateCookie(){}

  checkCookie(){}
  ////#endregion

  //#region Fake methods
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
//#endregion
}
