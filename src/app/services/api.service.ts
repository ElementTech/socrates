import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Block } from '../model/Block';
import { Instance } from '../model/Instance';
import { Flow } from '../model/Flow';
import { Flowviz } from '../model/Flowviz';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class ApiService {
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
  headers = new HttpHeaders().set('Content-Type', 'application/json').set("Authorization", `Bearer ${this.getToken()}`);

  constructor(private http: HttpClient) { }


   // Get all programming languages - WIP until dynamic docker images
  //  getLangs() {
  //   return this.http.get(`${this.webUri}/langs`);
  // }
  // Get all blocks
  getDashboard() {
    return this.http.get(`${this.baseUri}/dashboard`,{headers: this.headers});
  }

  getAllRuns() {
    return this.http.get(`${this.baseUri}/dashboard/runs`,{headers: this.headers});
  }
  
  getStorageUrl() {
    return this.http.get(`${this.baseUri}/storage`,{headers: this.headers});
  }
  // Create
  bulkParameter(data: any): Observable<any> {
    let url = `${this.baseUri}/parameter/bulk`;
    return this.http.post(url,data,{headers: this.headers})
      
  }

  // Create
  createParameter(data: any): Observable<any> {
    let url = `${this.baseUri}/parameter/create`;
    return this.http.post(url, data,{headers: this.headers})
      
  }

  // Get all blocks
  getParameters() {
    return this.http.get(`${this.baseUri}/parameter`,{headers: this.headers});
  }

  // Get block
  getParameter(id: any): Observable<any> {
    let url = `${this.baseUri}/parameter/read/${id}`;
    return this.http.get(url, {headers: this.headers}).pipe(

      catchError(this.errorMgmt)
    )
  }

  // Update block
  updateParameter(id: string, data: any): Observable<any> {
    let url = `${this.baseUri}/parameter/update/${id}`;
    return this.http.put(url, data, { headers: this.headers })
  }

  // Delete block
  deleteParameter(id: any): Observable<any> {
    let url = `${this.baseUri}/parameter/delete/${id}`;
    return this.http.delete(url, { headers: this.headers })
  }
  //--------------

  // Get all blocks
  getSchedules() {
    return this.http.get(`${this.baseUri}/schedule`,{headers: this.headers});
  }

  // Get all blocks
  getScheduleRuns() {
    return this.http.get(`${this.baseUri}/schedule/runs`,{headers: this.headers});
  }

  // Get block
  getSchedule(id: any): Observable<any> {
    let url = `${this.baseUri}/schedule/read/${id}`;
    return this.http.get(url, {headers: this.headers}).pipe(

      catchError(this.errorMgmt)
    )
  }


  // Delete block
  deleteSchedule(id: any): Observable<any> {
    let url = `${this.baseUri}/schedule/delete/${id}`;
    return this.http.delete(url, { headers: this.headers })
  }



  //---------------


    // Get all blocks
    getDynamicParameters() {
      return this.http.get(`${this.baseUri}/dynamic`,{headers: this.headers});
    }
  
    // Get block
    getDynamicParameter(id: any): Observable<any> {
      let url = `${this.baseUri}/dynamic/read/${id}`;
      return this.http.get(url, {headers: this.headers}).pipe(
  
        catchError(this.errorMgmt)
      )
    }
  
    // Update block
    updateDynamicParameter(id: string, data: any): Observable<any> {
      let url = `${this.baseUri}/dynamic/update/${id}`;
      return this.http.put(url, data, { headers: this.headers })
    }
  
    // Delete block
    deleteDynamicParameter(id: any): Observable<any> {
      let url = `${this.baseUri}/dynamic/delete/${id}`;
      return this.http.delete(url, { headers: this.headers })
    }


    createDynamicParameter(data: any): Observable<any> {
      let url = `${this.baseUri}/dynamic/create`;
      return this.http.post(url,data,{headers: this.headers})
        
    }
  // Create
  createBlock(data: any): Observable<any> {
    let url = `${this.baseUri}/block/create`;
    return this.http.post(url,data,{headers: this.headers})
      
  }

  // Get all blocks
  getBlocks() {
    return this.http.get<[Block]>(`${this.baseUri}/block`,{headers: this.headers});
  }

  // Get block
  getBlock(id: any): Observable<any> {
    let url = `${this.baseUri}/block/read/${id}`;
    return this.http.get(url, {headers: this.headers}).pipe(

      catchError(this.errorMgmt)
    )
  }

  // Update block
  updateBlock(id: string, data: any): Observable<any> {
    let url = `${this.baseUri}/block/update/${id}`;
    return this.http.put(url, data, { headers: this.headers })
  }

  // Delete block
  deleteBlock(id: any): Observable<any> {
    let url = `${this.baseUri}/block/delete/${id}`;
    return this.http.delete(url, { headers: this.headers }) as Observable<Block>
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
  createInstance(data: any): Observable<any> {
    let url = `${this.baseUri}/instance/create`;
    return this.http.post(url, data,{headers: this.headers})
      
  }

  // Get all blocks
  getInstances() {
    return this.http.get<[Instance]>(`${this.baseUri}/instance`,{headers: this.headers});
  }

  // Get block
  getInstance(id: any): Observable<any> {
    let url = `${this.baseUri}/instance/read/${id}`;
    return this.http.get(url, {headers: this.headers}).pipe(

      catchError(this.errorMgmt)
    )
  }

  // Update block
  updateInstance(id: string, data: any): Observable<any> {
    let url = `${this.baseUri}/instance/update/${id}`;
    return this.http.put(url, data, { headers: this.headers })
  }

  // Delete block
  deleteInstance(id: any): Observable<any> {
    let url = `${this.baseUri}/instance/delete/${id}`;
    return this.http.delete(url, { headers: this.headers })
  }

  runInstance(data: any): Observable<any> {
    let url = `${this.baseUri}/instance/run`;
    return this.http.post(url,data,{headers: this.headers})
  }

  scheduleInstance(data: any): Observable<any> {
    let url = `${this.baseUri}/instance/cron`;
    return this.http.post(url,data,{headers: this.headers})
  }
  scheduleFlow(data: any): Observable<any> {
    let url = `${this.baseUri}/flow/cron`;
    return this.http.post(url,data,{headers: this.headers})
  }
  scheduleFlowviz(data: any): Observable<any> {
    let url = `${this.baseUri}/flowviz/cron`;
    return this.http.post(url,data,{headers: this.headers})
  }

  runDynamicParameter(data: any): Observable<any> {
    let url = `${this.baseUri}/dynamic/run`;
    return this.http.post(url,data,{headers: this.headers})
      
  }

  runFlow(data: any): Observable<any> {
    let url = `${this.baseUri}/flow/run`;
    return this.http.post(url,data,{headers: this.headers})
      
  }
  runFlowviz(data: any): Observable<any> {
    let url = `${this.baseUri}/flowviz/run`;
    return this.http.post(url,data,{headers: this.headers})
      
  }

  // Docker


  // Get all blocks
  getDockerInstances() {
    return this.http.get(`${this.baseUri}/docker`,{headers: this.headers});
  }

  // Get block
  getDockerInstance(id: any): Observable<any> {
    let url = `${this.baseUri}/docker/read/${id}`;
    return this.http.get(url, {headers: this.headers}).pipe(

      catchError(this.errorMgmt)
    )
  }

    // Get block
    getFlowInstance(id: any): Observable<any> {
      let url = `${this.baseUri}/flow/instance/one/read/${id}`;
      return this.http.get(url, {headers: this.headers}).pipe(

        catchError(this.errorMgmt)
      )
    }
      // Get block
      getFlowvizInstance(id: any): Observable<any> {
        let url = `${this.baseUri}/flowviz/instance/one/read/${id}`;
        return this.http.get(url, {headers: this.headers}).pipe(

          catchError(this.errorMgmt)
        )
      }

    // Get block
    getBlockInstances(id: any): Observable<any> {
      let url = `${this.baseUri}/instance/block/read/${id}`;
      return this.http.get(url, {headers: this.headers}).pipe(

        catchError(this.errorMgmt)
      )
    }

  // Update block
  updateDockerInstance(id: string, data: any): Observable<any> {
    let url = `${this.baseUri}/docker/update/${id}`;
    return this.http.put(url, data, { headers: this.headers })
  }

  // Delete block
  deleteDockerInstance(id: any): Observable<any> {
    let url = `${this.baseUri}/docker/delete/${id}`;
    return this.http.delete(url, { headers: this.headers })
  }

    // Update block
    updateFlowInstance(id: string, data: any): Observable<any> {
      let url = `${this.baseUri}/flow/instance/update/${id}`;
      return this.http.put(url, data, { headers: this.headers })
    }
  
    // Delete block
    deleteFlowInstance(id: any): Observable<any> {
      let url = `${this.baseUri}/flow/instance/delete/${id}`;
      return this.http.delete(url, { headers: this.headers })
    }

        // Update block
      updateFlowvizInstance(id: string, data: any): Observable<any> {
        let url = `${this.baseUri}/flowviz/instance/update/${id}`;
        return this.http.put(url, data, { headers: this.headers }).pipe(
          catchError(this.errorMgmt)
        )
      }
    
      // Delete block
      deleteFlowvizInstance(id: any): Observable<any> {
        let url = `${this.baseUri}/flowviz/instance/delete/${id}`;
        return this.http.delete(url, { headers: this.headers }).pipe(
          catchError(this.errorMgmt)
        )
      }

  // Get block
  getDockerInstanceByInstanceID(id: any): Observable<any> {
    let url = `${this.baseUri}/docker/instance/read/${id}`;
    return this.http.get(url, {headers: this.headers}).pipe(

      catchError(this.errorMgmt)
    )
  }

  getBlockStatsByBlockID(id: any): Observable<any> {
    let url = `${this.baseUri}/block/stats/${id}`;
    return this.http.get(url, {headers: this.headers}).pipe(

      catchError(this.errorMgmt)
    )
  }

  getDockerInstanceStatsByInstanceID(id: any): Observable<any> {
    let url = `${this.baseUri}/docker/instance/read/stats/${id}`;
    return this.http.get(url, {headers: this.headers}).pipe(

      catchError(this.errorMgmt)
    )
  }

    // Get block
    getFlowInstanceByFlowID(id: any): Observable<any> {
      let url = `${this.baseUri}/flow/instance/read/${id}`;
      return this.http.get(url, {headers: this.headers}).pipe(

        catchError(this.errorMgmt)
      )
    }
  
    getFlowInstanceStatsByFlowID(id: any): Observable<any> {
      let url = `${this.baseUri}/flow/instance/read/stats/${id}`;
      return this.http.get(url, {headers: this.headers}).pipe(

        catchError(this.errorMgmt)
      )
    }

        // Get block
        getFlowvizInstanceByFlowvizID(id: any): Observable<any> {
          let url = `${this.baseUri}/flowviz/instance/read/${id}`;
          return this.http.get(url, {headers: this.headers}).pipe(

            catchError(this.errorMgmt)
          )
        }
      
        getFlowvizInstanceStatsByFlowvizID(id: any): Observable<any> {
          let url = `${this.baseUri}/flowviz/instance/read/stats/${id}`;
          return this.http.get(url, {headers: this.headers}).pipe(

            catchError(this.errorMgmt)
          )
        }

  // Settings

    // // Create
    // createSettings(data: any): Observable<any> {
    //   let url = `${this.baseUri}/block/create`;
    //   return this.http.post(url, data)
    //     .pipe(
    //       catchError(this.errorMgmt)
    //     )
    // }
  
    // Get all blocks
    getSettings() {
      return this.http.get(`${this.baseUri}/settings`,{headers: this.headers});
    }
  
    // Get block
    getSetting(id: any): Observable<any> {
      let url = `${this.baseUri}/settings/read/${id}`;
      return this.http.get(url, {headers: this.headers}).pipe(

        catchError(this.errorMgmt)
      )
    }
  
    // Update block
    updateSetting(id: string, data: any): Observable<any> {
      let url = `${this.baseUri}/settings/update/${id}`;
      return this.http.put(url, data, { headers: this.headers })
    }
  
  // Create
  createFlow(data: any): Observable<any> {
    let url = `${this.baseUri}/flow/create`;
    return this.http.post(url,data,{headers: this.headers})
      
  }

  // Get all blocks
  getFlows() {
    return this.http.get<[Flow]>(`${this.baseUri}/flow`,{headers: this.headers});
  }

  // Get block
  getFlow(id: any): Observable<any> {
    let url = `${this.baseUri}/flow/read/${id}`;
    return this.http.get(url, {headers: this.headers}).pipe(

      catchError(this.errorMgmt)
    )
  }

  // Update block
  updateFlow(id: string, data: any): Observable<any> {
    let url = `${this.baseUri}/flow/update/${id}`;
    return this.http.put(url, data, { headers: this.headers })
  }

  // Delete block
  deleteFlow(id: any): Observable<any> {
    let url = `${this.baseUri}/flow/delete/${id}`;
    return this.http.delete(url, { headers: this.headers })
  }






  // Create
  createFlowviz(data: any): Observable<any> {
    let url = `${this.baseUri}/flowviz/create`;
    return this.http.post(url,data,{headers: this.headers})
      
  }

  // Get all blocks
  getFlowvizs() {
    return this.http.get<[Flow]>(`${this.baseUri}/flowviz`,{headers: this.headers});
  }

  // Get block
  getFlowviz(id: any): Observable<any> {
    let url = `${this.baseUri}/flowviz/read/${id}`;
    return this.http.get(url, {headers: this.headers}).pipe(

      catchError(this.errorMgmt)
    )
  }

  // Update block
  updateFlowviz(id: string, data: any): Observable<any> {
    let url = `${this.baseUri}/flowviz/update/${id}`;
    return this.http.put(url, data, { headers: this.headers })
  }

  // Delete block
  deleteFlowviz(id: any): Observable<any> {
    let url = `${this.baseUri}/flowviz/delete/${id}`;
    return this.http.delete(url, { headers: this.headers })
  }







// Get all blocks
getGithubElements() {
  return this.http.get<[Block]>(`${this.baseUri}/github`,{headers: this.headers});
}

// Get block
getGithubElement(id: any): Observable<any> {
  let url = `${this.baseUri}/github/read/${id}`;
  return this.http.get(url, {headers: this.headers}).pipe(

    catchError(this.errorMgmt)
  )
}

// Update block
updateGithubElement(id: string, data: any): Observable<any> {
  let url = `${this.baseUri}/github/update/${id}`;
  return this.http.put(url, data, { headers: this.headers }).pipe(
    catchError(this.errorMgmt)
  )
}

// Delete block
deleteGithubElement(id: any): Observable<any> {
  let url = `${this.baseUri}/github/delete/${id}`;
  return this.http.delete(url, { headers: this.headers }).pipe(
    catchError(this.errorMgmt)
  )
}


// Get all blocks
getUsers() {
  return this.http.get<[Block]>(`${this.baseUri}/user`,{headers: this.headers});
}

// Get block
getUser(id: any): Observable<any> {
  let url = `${this.baseUri}/user/read/${id}`;
  return this.http.get(url, {headers: this.headers}).pipe(

    catchError(this.errorMgmt)
  )
}

// Update block
updateUser(id: string, data: any): Observable<any> {
  let url = `${this.baseUri}/user/update/${id}`;
  return this.http.put(url, data, { headers: this.headers }).pipe(
    catchError(this.errorMgmt)
  )
}

// Delete block
deleteUser(id: any): Observable<any> {
  let url = `${this.baseUri}/user/delete/${id}`;
  return this.http.delete(url, { headers: this.headers }).pipe(
    catchError(this.errorMgmt)
  )
}


}

// Instances

