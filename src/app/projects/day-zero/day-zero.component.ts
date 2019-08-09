import { Component, OnInit } from '@angular/core';
import { ProjectInfo } from '../../project_info';

export const DAYZERO: ProjectInfo = {
  id: 'day-zero',
  title: 'Day Zero Predictor',
  subtitle: 'EECS349 Final (2018)',
  description: 'Using machine learning to predict when a country will reach "Day Zero" - the time when its water supply is fully depleted'
}

@Component({
  selector: 'app-day-zero',
  templateUrl: './day-zero.component.html',
  styleUrls: ['./day-zero.component.css']
})
export class DayZeroComponent implements OnInit {
  projInfo = DAYZERO;

  constructor() { }

  ngOnInit() {
  }

}
