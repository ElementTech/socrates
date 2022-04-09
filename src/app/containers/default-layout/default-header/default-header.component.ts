import { Component, Input ,NgZone} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { interval, switchMap, tap } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ApiService } from '../../../services/api.service';
import {FilterService} from 'primeng/api';
@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  styleUrls: ['default-header.component.scss'],
  providers: [AuthenticationService]
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";
  display = false;
  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)

  constructor(
    private filterService: FilterService,private classToggler: ClassToggleService,public auth: AuthenticationService,
    private apiService: ApiService,
    private router: Router,
    private ngZone: NgZone,) {
    super();
  }

  logout()
  {
    this.auth.logout()
    this.ngZone.run(() => this.router.navigateByUrl('/login'))
  }

  toDocs()
  {
    window.location.href = window.location.protocol + "//" + window.location.host + "/api/docs"
  }

  getBorder(done,error){
    if (done)
    {
      if (error)
      {
        return '8px solid red'
      }
      else
      {
        return '8px solid green'
      }
    }
    else
    {
      return '8px solid grey'
    }
  }

  getRuntime(duration)
  {
    let runtime = []
    for (var key in duration) {
      if (duration.hasOwnProperty(key)) {
        runtime.push(key[0].toUpperCase()+":"+duration[key])
      }
    }
    return runtime
  }

  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));
  }

  userFilter: string;
  typeFilter: string;
  allUsers: any;
  all_runs:any;
  refresher: any;

  onUserFilter(event)
  {
    this.all_runs = this.all_runs.filter(item=>this.filterService.filters.equals(item.user,this.userFilter))
  }
  onTypeFilter(event)
  {
    this.all_runs = this.all_runs.filter(item=>this.filterService.filters.equals(item.type,this.typeFilter))
  }

  refreshSidebar()
  {
    // this.auth.profile().subscribe(data=>{
    //   this.userFilter = data.name
    // })
    this.allUsers = this.apiService.getUsers().toPromise()
    this.all_runs = this.apiService.getAllRuns().subscribe(data=>{
      this.all_runs = data
    })
    this.refresher = interval(1000).pipe(
      switchMap(() => this.apiService.getAllRuns())
    ).subscribe((data:any)=>{
      this.all_runs = data.filter(item=>this.filterService.filters.equals(item.user,this.userFilter)).filter(item=>this.filterService.filters.equals(item.type,this.typeFilter))
    })
  }
  hideSidebar()
  {
    this.refresher.unsubscribe()
  }

  ngOnInit(){
    this.all_runs = this.apiService.getAllRuns().subscribe(data=>{
      this.all_runs = data
    })
  }
  runningNow()
  {
    return this.all_runs.filter(it=>!it.done).length
  }
 
  ngAfterViewInit()
  {
    // Designed by: Hoang Nguyen
    // Original image: https://dribbble.com/shots/5919154-Tab-Bar-Label-Micro-Interaction

    const buttons = document.querySelectorAll(".menu__item");
    let activeButton = document.querySelector(".menu__item.active");

    buttons.forEach(item => {

        const text = item.querySelector(".menu__text");
        setLineWidth(text, item);

        window.addEventListener("resize", () => {
            setLineWidth(text, item);
        })
        item.addEventListener("click", function() {
            if (this.classList.contains("active")) return;
            
            this.classList.add("active");
            
            if (activeButton) {
                activeButton.classList.remove("active");
                activeButton.querySelector(".menu__text").classList.remove("active");
            }
            
            handleTransition(this, text);
            activeButton = this;

        });

        
        });


        function setLineWidth(text, item) {
            const lineWidth = text.offsetWidth + "px";
            item.style.setProperty("--lineWidth", lineWidth);
        }

        function handleTransition(item, text) {

            item.addEventListener("transitionend", (e) => {

                if (e.propertyName != "flex-grow" || 
                !item.classList.contains("active")) return;

                text.classList.add("active");
                
            });

        }
      }
}
