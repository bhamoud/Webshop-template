import { Component, OnInit, Input } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() pageTitle: string;
  @Input() iconTitle: string;
  @Input() helpTitle: string;
  configData;
  counter= 0;
  userStatusColor= "warn";

  constructor(private _backendservice: BackendService) { }

  ngOnInit(): void {
    this.counter = 0;
    this.configData = this._backendservice.getConfig();
    this._backendservice.getCartTotal().subscribe(
      (res) => {
        this.counter = res;
      }
    );
    this._backendservice.getUserStatus().subscribe(
      (res) =>{
        this.userStatusColor = res ? "primary" : "warn";
      }
    );
  }

}
