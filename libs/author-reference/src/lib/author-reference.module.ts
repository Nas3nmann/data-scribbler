import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthorReferenceComponent } from './author-reference/author-reference.component';

@NgModule({
  imports: [CommonModule],
  declarations: [AuthorReferenceComponent],
  exports: [AuthorReferenceComponent],
})
export class AuthorReferenceModule {}
