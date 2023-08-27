import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { catchError, map, throwError, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string) {
    const postData: Post = { title, content };
    return this.http
      .post<{ name: string }>(
        'https://angular-973bf-default-rtdb.firebaseio.com/posts.json',
        postData,
        {
          observe: 'response',
        }
      )
      .subscribe({
        next: (responseData) => {
          console.log(responseData.body);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  fetchPosts() {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty');
    searchParams = searchParams.append('custom', 'key');
    return this.http
      .get<{ [key: string]: Post }>(
        'https://angular-973bf-default-rtdb.firebaseio.com/posts.json',
        {
          headers: new HttpHeaders({ 'Custom-Header': 'Hello' }),
          params: searchParams,
        }
      )
      .pipe(
        map((responseData) => {
          const postsArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        })
        // catchError((errorRes) => {
        //   // ......
        //   return throwError(() => new Error(errorRes));
        // })
      );
  }

  deletePosts() {
    return this.http
      .delete('https://angular-973bf-default-rtdb.firebaseio.com/posts.json', {
        observe: 'events',
        responseType: 'text',
      })
      .pipe(
        tap((event) => {
          console.log(event);
          if (event.type === HttpEventType.Sent) {
            // ...
          }
          if (event.type === HttpEventType.Response) {
            console.log(event.body);
          }
        })
      );
  }
}
