import { BlogFeedComponent } from './blog-feed/blog-feed.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BlogRoutingModule } from './blog-routing.module';
import { BlogMaterialModule } from './blog-material.module';
import { BlogEditComponent } from './blog-edit/blog-edit.component';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [BlogEditComponent, BlogFeedComponent],
  imports: [
    BlogMaterialModule,
    BlogRoutingModule,
    ReactiveFormsModule
  ],
  exports: [],
})
export class BlogModule {}
