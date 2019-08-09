import { Component, OnInit } from '@angular/core';
import { ProjectInfo } from '../../project_info';

export const ARGO: ProjectInfo = {
  id: 'argo',
  title: 'Argo',
  subtitle: 'MSR Winter Project (2018)',
  description: 'An autonomous differential drive suitcase that uses AR tags to track and follow objects in its environment'
}

@Component({
  selector: 'app-argo',
  templateUrl: './argo.component.html',
  styleUrls: ['./argo.component.css']
})
export class ArgoComponent implements OnInit {
  projInfo = ARGO;

  constructor() { }

  ngOnInit() {
  }

}
