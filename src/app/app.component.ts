import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { PostService } from './posts.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;
  @ViewChild('postForm') form: NgForm;

  constructor(private http: HttpClient, private postService: PostService) {}

  ngOnInit() {
    this.fetchPosts();
  }

  onCreatePost(postData: Post) {
    // Send Http request
    this.postService.createAndStorePost(postData.title, postData.content);
    // .subscribe(() => {
    //   this.fetchPosts();
    // });
    this.form.reset();
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }

  // ~~~deprecated~~~

  // fetchPosts() {
  //   this.isFetching = true;
  //   this.postService.fetchPosts().subscribe(
  //     (posts) => {
  //       this.loadedPosts = posts;
  //       this.isFetching = false;
  //     },
  //     (error) => {
  //       this.error = error.message;
  //       console.log(error);
  //     }
  //   );
  // }

  fetchPosts() {
    this.isFetching = true;
    this.postService.fetchPosts().subscribe({
      next: (posts) => {
        this.loadedPosts = posts;
        this.isFetching = false;
      },
      error: (error) => {
        this.isFetching = false;
        this.error = error.message;
        console.log(error);
      },
    });
  }

  onClearPosts() {
    // Send Http request
    this.postService.deletePosts().subscribe(() => this.fetchPosts());
  }

  onHandleError() {
    this.error = null;
  }
}
