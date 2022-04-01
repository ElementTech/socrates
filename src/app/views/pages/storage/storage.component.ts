import { Component } from '@angular/core';
import { ApiService } from '../../../services/api.service';
@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.scss']
})
export class StorageComponent {


  constructor (private apiService: ApiService) {
  }
  ngOnInit() {
    this.apiService.getStorageUrl().subscribe(data=>{
      
      window.location.href = data.toString();


    })
        
  }
} 