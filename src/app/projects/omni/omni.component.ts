import { Component, OnInit } from '@angular/core';
import { ProjectInfo } from '../../project_info';

export const OMNI: ProjectInfo = {
  id: 'omni',
  title: 'The Omni Project',
  subtitle: 'MSR Final Project (2018)',
  description: 'Using machine learning to predict when a country will reach "Day Zero" - the time when its water supply is fully depleted'
}

@Component({
  selector: 'app-omni',
  templateUrl: './omni.component.html',
  styleUrls: ['./omni.component.css']
})

export class OmniComponent implements OnInit {
  projInfo = OMNI;

  constructor() { }

  ngOnInit() {
  }

}
