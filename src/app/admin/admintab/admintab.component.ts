import { Component, OnInit } from '@angular/core';
import { fallIn, moveIn } from '../../shared/router.animations';

@Component({
  selector: 'app-admintab',
  templateUrl: './admintab.component.html',
  styleUrls: ['./admintab.component.scss'],
  animations: [moveIn(), fallIn()],
  host: {'[@moveIn]': ''}
})
export class AdmintabComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
