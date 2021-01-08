import { Component, OnInit } from '@angular/core';
import { fallIn, moveIn } from '../shared/router.animations';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  animations: [moveIn(), fallIn()],
  host: {'[@moveIn]': ''}
})
export class SettingsComponent implements OnInit {
  state: string = '';
  
  constructor() { }

  ngOnInit(): void {
  }

}
