import { Component, OnInit } from '@angular/core';
import { fallIn, moveIn } from '../router.animations';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  animations: [moveIn(), fallIn()],
  host: {'[@moveIn]': ''}
})
export class AboutComponent implements OnInit {
  state: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
