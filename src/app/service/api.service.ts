import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Block } from '../model/Block';
import { Instance } from '../model/Instance';
import { Flow } from '../model/Flow';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class ApiService {


  //baseUri:string = 'http://'+environment.api+':4000/api';
  baseUri:string = window.location.protocol + '//' + window.location.host + '/api'
  //webUri:string = 'http://localhost:4000/api/web';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }


   // Get all programming languages - WIP until dynamic docker images
  //  getLangs() {
  //   return this.http.get(`${this.webUri}/langs`);
  // }

  // Create
  bulkParameter(data): Observable<any> {
    let url = `${this.baseUri}/parameter/bulk`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Create
  createParameter(data): Observable<any> {
    let url = `${this.baseUri}/parameter/create`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Get all blocks
  getParameters() {
    return this.http.get(`${this.baseUri}/parameter`);
  }

  // Get block
  getParameter(id): Observable<any> {
    let url = `${this.baseUri}/parameter/read/${id}`;
    return this.http.get(url, {headers: this.headers}).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.errorMgmt)
    )
  }

  // Update block
  updateParameter(id, data): Observable<any> {
    let url = `${this.baseUri}/parameter/update/${id}`;
    return this.http.put(url, data, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }

  // Delete block
  deleteParameter(id): Observable<any> {
    let url = `${this.baseUri}/parameter/delete/${id}`;
    return this.http.delete(url, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }


  // Create
  createBlock(data): Observable<any> {
    let url = `${this.baseUri}/block/create`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Get all blocks
  getBlocks() {
    return this.http.get<[Block]>(`${this.baseUri}/block`);
  }

  // Get block
  getBlock(id): Observable<any> {
    let url = `${this.baseUri}/block/read/${id}`;
    return this.http.get(url, {headers: this.headers}).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.errorMgmt)
    )
  }

  // Update block
  updateBlock(id, data): Observable<any> {
    let url = `${this.baseUri}/block/update/${id}`;
    return this.http.put(url, data, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }

  // Delete block
  deleteBlock(id): Observable<any> {
    let url = `${this.baseUri}/block/delete/${id}`;
    return this.http.delete(url, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }

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

  // Create
  createInstance(data): Observable<any> {
    let url = `${this.baseUri}/instance/create`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Get all blocks
  getInstances() {
    return this.http.get<[Instance]>(`${this.baseUri}/instance`);
  }

  // Get block
  getInstance(id): Observable<any> {
    let url = `${this.baseUri}/instance/read/${id}`;
    return this.http.get(url, {headers: this.headers}).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.errorMgmt)
    )
  }

  // Update block
  updateInstance(id, data): Observable<any> {
    let url = `${this.baseUri}/instance/update/${id}`;
    return this.http.put(url, data, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }

  // Delete block
  deleteInstance(id): Observable<any> {
    let url = `${this.baseUri}/instance/delete/${id}`;
    return this.http.delete(url, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }

  runInstance(data): Observable<any> {
    let url = `${this.baseUri}/instance/run`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  runFlow(data): Observable<any> {
    let url = `${this.baseUri}/flow/run`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Docker


  // Get all blocks
  getDockerInstances() {
    return this.http.get(`${this.baseUri}/docker`);
  }

  // Get block
  getDockerInstance(id): Observable<any> {
    let url = `${this.baseUri}/docker/read/${id}`;
    return this.http.get(url, {headers: this.headers}).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.errorMgmt)
    )
  }

    // Get block
    getFlowInstance(id): Observable<any> {
      let url = `${this.baseUri}/flow/instance/one/read/${id}`;
      return this.http.get(url, {headers: this.headers}).pipe(
        map((res: Response) => {
          return res || {}
        }),
        catchError(this.errorMgmt)
      )
    }
  

    // Get block
    getBlockInstances(id): Observable<any> {
      let url = `${this.baseUri}/instance/block/read/${id}`;
      return this.http.get(url, {headers: this.headers}).pipe(
        map((res: Response) => {
          return res || {}
        }),
        catchError(this.errorMgmt)
      )
    }

  // Update block
  updateDockerInstance(id, data): Observable<any> {
    let url = `${this.baseUri}/docker/update/${id}`;
    return this.http.put(url, data, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }

  // Delete block
  deleteDockerInstance(id): Observable<any> {
    let url = `${this.baseUri}/docker/delete/${id}`;
    return this.http.delete(url, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }

    // Update block
    updateFlowInstance(id, data): Observable<any> {
      let url = `${this.baseUri}/flow/instance/update/${id}`;
      return this.http.put(url, data, { headers: this.headers }).pipe(
        catchError(this.errorMgmt)
      )
    }
  
    // Delete block
    deleteFlowInstance(id): Observable<any> {
      let url = `${this.baseUri}/flow/instance/delete/${id}`;
      return this.http.delete(url, { headers: this.headers }).pipe(
        catchError(this.errorMgmt)
      )
    }

  // Get block
  getDockerInstanceByInstanceID(id): Observable<any> {
    let url = `${this.baseUri}/docker/instance/read/${id}`;
    return this.http.get(url, {headers: this.headers}).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.errorMgmt)
    )
  }

  getDockerInstanceStatsByInstanceID(id): Observable<any> {
    let url = `${this.baseUri}/docker/instance/read/stats/${id}`;
    return this.http.get(url, {headers: this.headers}).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.errorMgmt)
    )
  }

    // Get block
    getFlowInstanceByFlowID(id): Observable<any> {
      let url = `${this.baseUri}/flow/instance/read/${id}`;
      return this.http.get(url, {headers: this.headers}).pipe(
        map((res: Response) => {
          return res || {}
        }),
        catchError(this.errorMgmt)
      )
    }
  
    getFlowInstanceStatsByFlowID(id): Observable<any> {
      let url = `${this.baseUri}/flow/instance/read/stats/${id}`;
      return this.http.get(url, {headers: this.headers}).pipe(
        map((res: Response) => {
          return res || {}
        }),
        catchError(this.errorMgmt)
      )
    }

  // Settings

    // // Create
    // createSettings(data): Observable<any> {
    //   let url = `${this.baseUri}/block/create`;
    //   return this.http.post(url, data)
    //     .pipe(
    //       catchError(this.errorMgmt)
    //     )
    // }
  
    // Get all blocks
    getSettings() {
      return this.http.get(`${this.baseUri}/settings`);
    }
  
    // Get block
    getSetting(id): Observable<any> {
      let url = `${this.baseUri}/settings/read/${id}`;
      return this.http.get(url, {headers: this.headers}).pipe(
        map((res: Response) => {
          return res || {}
        }),
        catchError(this.errorMgmt)
      )
    }
  
    // Update block
    updateSetting(id, data): Observable<any> {
      let url = `${this.baseUri}/settings/update/${id}`;
      return this.http.put(url, data, { headers: this.headers }).pipe(
        catchError(this.errorMgmt)
      )
    }
  
  // Create
  createFlow(data): Observable<any> {
    let url = `${this.baseUri}/flow/create`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Get all blocks
  getFlows() {
    return this.http.get<[Flow]>(`${this.baseUri}/flow`);
  }

  // Get block
  getFlow(id): Observable<any> {
    let url = `${this.baseUri}/flow/read/${id}`;
    return this.http.get(url, {headers: this.headers}).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.errorMgmt)
    )
  }

  // Update block
  updateFlow(id, data): Observable<any> {
    let url = `${this.baseUri}/flow/update/${id}`;
    return this.http.put(url, data, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }

  // Delete block
  deleteFlow(id): Observable<any> {
    let url = `${this.baseUri}/flow/delete/${id}`;
    return this.http.delete(url, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }


}

// Instances

