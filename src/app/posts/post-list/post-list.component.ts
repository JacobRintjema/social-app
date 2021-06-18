import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  isLoading: boolean = false;
  totalPosts: number = 0;
  postsPerPage: number = 2;
  currPage: number = 1;
  pageSizeOptions = [1, 2, 5, 10];

  private postsSub: Subscription;
  private authStatusSub: Subscription;
  authenticated: boolean = false;
  userId: string;

  constructor(public postsService: PostsService, private auth: AuthService) {

  }
  ngOnInit(): void {
    this.isLoading = true;
    this.userId = this.auth.getUserId();
    this.postsService.getPosts(this.postsPerPage, this.currPage);
    this.postsSub = this.postsService.getPostUpdateListener().subscribe((postData: {posts: Post[], postCount: number}) => {
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
    });

    this.authenticated = this.auth.getIsAuthenticated();
    this.authStatusSub = this.auth.getAuthStatusListener().subscribe(isAuthenticated => {
      this.authenticated = isAuthenticated;
      this.userId = this.auth.getUserId();
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currPage);
    });
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currPage);
  }
}
