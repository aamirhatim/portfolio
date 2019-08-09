import { Component, OnInit } from '@angular/core';

import { PROJECTS } from '../project_list';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  projects = PROJECTS;

  constructor() { }

  ngOnInit() {
  }

}
