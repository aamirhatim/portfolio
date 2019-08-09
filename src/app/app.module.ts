import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { OmniComponent } from './projects/omni/omni.component';
import { ArticleComponent } from './article/article.component';
import { ArticleHeaderComponent } from './article-header/article-header.component';

@NgModule({
  declarations: [
    AppComponent,
    PortfolioComponent,
    OmniComponent,
    ArticleComponent,
    ArticleHeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
