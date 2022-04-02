import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthorReferenceModule } from '@jdrks/author-reference';
import { CopyButtonModule } from '@jdrks/copy-button';
import { DarkModeModule } from '@jdrks/dark-mode';
import { DistanceSliderModule } from '@jdrks/distance-slider';
import { LogoModule } from '@jdrks/logo';
import { ScribblingModule } from '@jdrks/scribbling';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ScribblingModule,
    DistanceSliderModule,
    LogoModule,
    AuthorReferenceModule,
    DarkModeModule,
    CopyButtonModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
