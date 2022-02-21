import { Injectable } from '@angular/core';
import { v4 } from 'uuid';
import { FileElement } from '../model/element';
import { BehaviorSubject, catchError, map, tap } from 'rxjs';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export interface IFileService {
  add(fileElement: FileElement);
  delete(id: string);
  update(id: string, update: Partial<FileElement>);
  queryInFolder(folderId: string): Observable<FileElement[]>;
  get(id: string): Observable<any>;
}

@Injectable()
export class FileService implements IFileService {
  private token: string;
  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }
  private map = new Map<string, FileElement>();

  constructor(private http: HttpClient) {}

  //baseUri:string = 'http://'+environment.api+':4000/api';
  baseUri:string = window.location.protocol + '//' + window.location.host + '/api'
  headers = new HttpHeaders().set('Content-Type', 'application/json').set("Authorization", `Bearer ${this.getToken()}`);

  // Error handling 
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  add(fileElement: FileElement): Observable<any> {
    let url = `${this.baseUri}/file/create`;
    fileElement.id = v4();
    return this.http.post(url, fileElement, { headers: this.headers })
    .pipe(
      tap( // Log the result or error
      {
        next: (data) => {this.map.set(data.id, this.clone(data))},
        error: (error) => catchError(this.errorMgmt)
      }
      )
    );
  }

  // add(fileElement: FileElement) {
  //   fileElement.id = v4();
  //   this.map.set(fileElement.id, this.clone(fileElement));
  //   return fileElement;
  // }

  delete(id: string): Observable<any> {
    let url = `${this.baseUri}/file/delete/${id}`;
    return this.http.delete(url, { headers: this.headers })
    .pipe(
      tap( // Log the result or error
      {
        next: (data) => {this.map.delete(id)},
        error: (error) => catchError(this.errorMgmt)
      }
      )
    );
  }

  // delete(id: string) {
  //   this.map.delete(id);
  // }

  update(id: string, update: Partial<FileElement>): Observable<any> {
    let url = `${this.baseUri}/file/update/${id}`;
    let element = this.map.get(id);
    element = Object.assign(element, update);
    return this.http.put(url, element, { headers: this.headers })
    .pipe(
      tap( // Log the result or error
      {
        next: (data) => this.map.set(element.id, data),
        error: (error) => catchError(this.errorMgmt)
      }
      )
    );
  }

  // update(id: string, update: Partial<FileElement>) {
  //   let element = this.map.get(id);
  //   element = Object.assign(element, update);
  //   this.map.set(element.id, element);
  // }

  private querySubject: BehaviorSubject<FileElement[]>;
  queryInFolder(folderId: string) {
    const result: FileElement[] = [];
    this.map.forEach(element => {
      if (element.parent === folderId) {
        result.push(this.clone(element));
      }
    });
    if (!this.querySubject) {
      this.querySubject = new BehaviorSubject(result);
    } else {
      this.querySubject.next(result);
    }
    return this.querySubject.asObservable();
  }

  getAll() {
    return this.http.get<any>(`${this.baseUri}/file`, { headers: this.headers })
    .pipe(
      tap( // Log the result or error
      {
        
        next: (data) => data.forEach(file=>{this.map.set(file.id, this.clone(file))}),
        error: (error) => catchError(this.errorMgmt)
      }
      )
    );
  }

  get(id): Observable<any> {
    let url = `${this.baseUri}/file/read/${id}`;
    return this.http.get<any>(url, {headers: this.headers}).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.errorMgmt)
    )
  }


  // get(id: string) {
  //   return this.map.get(id);
  // }

  clone(element: Object) {
    return JSON.parse(JSON.stringify(element));
  }
}
