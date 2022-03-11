import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private token: any = "";
  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  //baseUri:string = 'http://'+environment.api+':4000/api';
  baseUri:string = window.location.protocol + '//' + window.location.host + '/api'
  //webUri:string = 'http://localhost:4000/api/web';
  headers = new HttpHeaders().set("Authorization", `Bearer ${this.getToken()}`);
  constructor(private http: HttpClient) { }
  upload(file: File): Observable<HttpEvent<any>> {
    console.log(file)
    const formData: FormData = new FormData();
    formData.append('file', file);
    const req = new HttpRequest('POST', `${this.baseUri}/image/upload`, formData, {
      reportProgress: true,
      responseType: 'json',
      headers: this.headers
    });
    return this.http.request(req);
  }
  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUri}/image/files`,{headers: this.headers});
  }
  downloadFile(name: string): any {
    return this.http.get(`${this.baseUri}/image/files/${name}`,{responseType: 'blob',headers: this.headers}).subscribe(res => {
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      const blob = new Blob([res], { type: res.type });
      const url = window.URL.createObjectURL(blob);
      a.href = url; a.download = name; a.click();
      window.URL.revokeObjectURL(url);
    });
  }
  getFileImage(name: string | number): Observable<any>{
    return this.http.get(`${this.baseUri}/image/files/${name}`,{responseType: 'blob',headers: this.headers})
  }
  deleteFile(name: any): Observable<any> {
    let url = `${this.baseUri}/image/files/delete/${name}`;
    return this.http.delete(url, { headers: this.headers })
  }

}