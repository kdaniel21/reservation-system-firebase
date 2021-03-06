import { BlogFeedComponent } from './blog-feed/blog-feed.component';
import { BlogEditComponent } from './blog-edit/blog-edit.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BlogViewComponent } from './blog-view/blog-view.component';

const routes = [
  { path: '', redirectTo: 'feed', pathMatch: 'full' },
  { path: 'edit', component: BlogEditComponent },
  { path: 'latest', component: BlogFeedComponent },
  { path: ':url', component: BlogViewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogRoutingModule {}
