import { BlogViewComponent } from './blog-view/blog-view.component';
import { SharedModule } from './../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { BlogFeedComponent } from './blog-feed/blog-feed.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BlogRoutingModule } from './blog-routing.module';
import { BlogMaterialModule } from './blog-material.module';
import { BlogEditComponent } from './blog-edit/blog-edit.component';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [BlogEditComponent, BlogFeedComponent, BlogViewComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BlogMaterialModule,
    BlogRoutingModule,
    FlexLayoutModule,
    SharedModule,
  ],
  exports: [],
})
export class BlogModule {}
