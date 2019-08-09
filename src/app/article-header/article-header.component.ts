import { Component, OnInit, Input } from '@angular/core';
import { ProjectInfo } from '../project_info';

@Component({
  selector: 'app-article-header',
  templateUrl: './article-header.component.html',
  styleUrls: ['./article-header.component.css']
})
export class ArticleHeaderComponent implements OnInit {
  @Input() info: ProjectInfo;
  
  constructor() { }

  ngOnInit() {
  }

}
