import { BlogFeedComponent } from './blog-feed/blog-feed.component';
import { BlogEditComponent } from './blog-edit/blog-edit.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes = [
  { path: '', redirectTo: 'feed', pathMatch: 'full' },
  { path: 'edit', component: BlogEditComponent },
  { path: 'create', component: BlogEditComponent },
  { path: 'feed', component: BlogFeedComponent },
  { path: 'latest', component: BlogFeedComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogRoutingModule {}
