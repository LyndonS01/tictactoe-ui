import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

// import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CellsComponent } from './components/cells/cells.component';
import { MessagesComponent } from './components/messages/messages.component';

@NgModule({
  declarations: [AppComponent, CellsComponent, MessagesComponent],
  imports: [
    BrowserModule,
    // AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'home', component: CellsComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', redirectTo: 'home', pathMatch: 'full' },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
