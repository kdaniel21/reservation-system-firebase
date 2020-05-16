import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { Post } from 'src/app/blog/post.model';
import { Subscription } from 'rxjs';
import { AdminBlogService } from '../admin-blog.service';

@Component({
  selector: 'app-admin-blog-list',
  templateUrl: './admin-blog-list.component.html',
  styleUrls: ['./admin-blog-list.component.css'],
})
export class AdminBlogListComponent implements OnInit, OnDestroy {
  displayedColumns = ['title', 'author', 'date', 'public'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: MatTableDataSource<Post>;

  loading: boolean;
  postsSub: Subscription;

  constructor(private blogService: AdminBlogService) {}

  ngOnInit() {
    this.loading = true;

    this.postsSub = this.blogService.getPosts().subscribe((posts) => {
      this.loading = false;

      this.dataSource = new MatTableDataSource(posts);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
