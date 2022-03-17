import { Instance } from '../../../model/Instance';
import { Component, OnInit , NgZone, ViewEncapsulation,ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from '../../../services/api.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FormArray } from '@angular/forms';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, interval, map, Observable, pairwise, switchMap, throttleTime, timer } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';



@Component({
  selector: 'app-instance-run',
  templateUrl: './instance-run.component.html',
  styleUrls: ['./instance-run.component.scss']
})
export class InstanceRunComponent implements OnInit {
 
  dataSource: MatTableDataSource<any>;
  Instance= {name:"name",desc:"desc",parameters:[],shared:[],booleans:[],multis:[]};
  displayedColumns = ['name','desc','parameters'];
  output: String = "";
  runNumber: any;
  id: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  //@ViewChild('sidenav') public sidenav: MatSidenav;
  run_id: any;
  subscription: any;
  // Infinite Scrolling ------------------
  @ViewChild('scroller') scroller: CdkVirtualScrollViewport;
  loading: boolean = false;
  listItems = [];
  alreadyLoaded=0;
  fetchedLatestRun = false;
  SubscribeNow = true;
  dockerOutput: any;
  run: string;
  // ----

  constructor(
    public fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private ngZone: NgZone
  ) {  
  
    this.id = this.actRoute.snapshot.paramMap.get('id');
    this.run = this.actRoute.snapshot.paramMap.get('run');

    this.getInstance(this.id);
   
  }

  ngOnInit() {
    this.fetchMoreInit()

    
  }// Good

  ani() {
      document.getElementById('play-btn').classList.add("play-btn-animate");
      this._snackBar.open('Instance Started', 'Close', {
        duration: 3000
      });
      this.runInstance(this.id)
  }// Good

  // ngAfterViewInit(){
  //   this.scroller.elementScrolled().pipe(
  //     map(() => this.scroller.measureScrollOffset('bottom')),
  //     pairwise(),
  //     filter(([y1, y2]) => (y2 < y1 && y2 < 140)),
  //     throttleTime(200)
  //   ).subscribe(() => {
  //     this.ngZone.run(() => {
  //       this.fetchMore(false);
  //     });
  //   }
  //   )
   
  // }// Good
 

  ngAfterViewChecked() { 
    if (document.querySelector<HTMLElement>('.CodeMirror') != null)
    {
      if (document.querySelector<HTMLElement>('.CodeMirror').style.getPropertyValue('height') != "85vh")
      {
        document.querySelector<HTMLElement>('.CodeMirror').style.setProperty('height', '85vh');
      }
    }
    

   
  }// Good
  fullScreenToggle = true;

  getBorder(content){
    if (content == "Success")
    {
      return '8px solid green'
    }
    if (content == "Fail")
    {
      return '8px solid red'
    }
    if (content == "Running...")
    {
      return '8px solid grey'
    }
    return ''
  }

  fullScreen(evt, input) {
      var code = evt.charCode || evt.keyCode;
      console.log("before")
      if (code == 27) {
        if (this.fullScreenToggle)
        {
          document.querySelector<HTMLElement>('.CodeMirror').style.setProperty('position','fixed')
          document.querySelector<HTMLElement>('.CodeMirror').style.setProperty('top','8%')
          document.querySelector<HTMLElement>('.CodeMirror').style.setProperty('left','0')
          document.querySelector<HTMLElement>('.CodeMirror').style.setProperty('right','0')
          document.querySelector<HTMLElement>('.CodeMirror').style.setProperty('bottom','0')
          document.querySelector<HTMLElement>('.CodeMirror').style.setProperty('height','100%')
          document.querySelector<HTMLElement>('.CodeMirror').style.setProperty('z-index','9999')
          this.fullScreenToggle = false;
        }
        else{
          document.querySelector<HTMLElement>('.CodeMirror').style.removeProperty('position')
          document.querySelector<HTMLElement>('.CodeMirror').style.removeProperty('top')
          document.querySelector<HTMLElement>('.CodeMirror').style.removeProperty('left')
          document.querySelector<HTMLElement>('.CodeMirror').style.removeProperty('right')
          document.querySelector<HTMLElement>('.CodeMirror').style.removeProperty('bottom')
          document.querySelector<HTMLElement>('.CodeMirror').style.removeProperty('height')
          document.querySelector<HTMLElement>('.CodeMirror').style.removeProperty('z-index')
          this.fullScreenToggle = true;
        }
      }
  }

  makeFull(){
    if (this.fullScreenToggle)
    {
      document.querySelector<HTMLElement>('.CodeMirror').style.setProperty('position','fixed')
      document.querySelector<HTMLElement>('.CodeMirror').style.setProperty('top','8%')
      document.querySelector<HTMLElement>('.CodeMirror').style.setProperty('left','0')
      document.querySelector<HTMLElement>('.CodeMirror').style.setProperty('right','0')
      document.querySelector<HTMLElement>('.CodeMirror').style.setProperty('bottom','0')
      document.querySelector<HTMLElement>('.CodeMirror').style.setProperty('height','100%')
      document.querySelector<HTMLElement>('.CodeMirror').style.setProperty('z-index','9999')
      this.fullScreenToggle = false;
    }
    else{
      document.querySelector<HTMLElement>('.CodeMirror').style.removeProperty('position')
      document.querySelector<HTMLElement>('.CodeMirror').style.removeProperty('top')
      document.querySelector<HTMLElement>('.CodeMirror').style.removeProperty('left')
      document.querySelector<HTMLElement>('.CodeMirror').style.removeProperty('right')
      document.querySelector<HTMLElement>('.CodeMirror').style.removeProperty('bottom')
      document.querySelector<HTMLElement>('.CodeMirror').style.removeProperty('height')
      document.querySelector<HTMLElement>('.CodeMirror').style.removeProperty('z-index')
      this.fullScreenToggle = true;
    }
  }


  updateConsole(run_id)
  {
    
    let updatedInList = false
    this.subscription = interval(1000)
    .pipe(
        switchMap(() => this.apiService.getDockerInstance(run_id)),
        map(response => {
          this.setRunID(run_id)
          if (Object.keys(response ? response : []).length == 0)
          {
            return true;
          }
          else
          {
            if (updatedInList == false)
            {
              this.fetchMore(true)
              updatedInList = true
            }
            else
            {
              for (let index = 0; index < this.listItems.length; index++) {
                const element = this.listItems[index];
                if (element.id == run_id)
                {
                  let runtime = []
                  for (var key in response.runtime) {
                    if (response.runtime.hasOwnProperty(key)) {
                      runtime.push(key[0].toUpperCase()+":"+response.runtime[key])
                    }
                  }
                  this.listItems[index].runtime = runtime
                }
                else
                {
                  if ((element.content == "Running...") && (element.id != run_id))
                  {
                    let runtime = []
                    this.apiService.getDockerInstance(element.id).subscribe(data => {
                  
                        for (var key in data.runtime) {
                          if (data.runtime.hasOwnProperty(key)) {
                            runtime.push(key[0].toUpperCase()+":"+data.runtime[key])
                          }
                        }
                        this.listItems[index].runtime = runtime
                        if (data.done)
                        {
                          this.listItems[index].image = {"true": "../../assets/fail.png","false": "../../assets/success.png"}[data.error.toString()]
                          this.listItems[index].content = {"true": "Fail","false": "Success"}[data.error.toString()]
                        }
                     
                    });
                 
                  }
 
                }
              }
            }
            this.output=response.console.join("\r\n")
            this.dockerOutput = response.output

            // this.scrollLogToBottom()
            if(response.done == false) 
            {
              return response.data;
            }
            else 
            {
              return false; //or some error message or data.
            }
          }
        })
    )
    .subscribe(response => {
       if (response == false)
       {
         document.getElementById('play-btn').classList.remove("play-btn-animate");
         this.fetchMore(true)
         this.subscription.unsubscribe();
       }
    });
  }// Good

  runInstance(id) {
    try{
      this.subscription.unsubscribe();
    }
    catch{
      console.log("Unsubscribing")
    }
    console.log({"text":this.Instance.parameters,"shared":this.Instance.shared,"bool":this.Instance.booleans,"multis":this.Instance.multis})
    this.apiService.runInstance({"id":id,"parameters":this.Instance.parameters,"shared":this.Instance.shared,"booleans":this.Instance.booleans,
    "multis":this.Instance.multis}).subscribe(
      (res) => {
       
        this._snackBar.open('Instance Run Started', 'Close', {
          duration: 3000
        });
        this.updateConsole(res)
        
      }, (error) => {
        console.log(error);
    });
  }// Good

  setRunID(id)
  {
    for (let index = 0; index < this.listItems.length; index++) {
      const element = this.listItems[index];
      if (element.id == id)
      {
        this.runNumber = element.run_number;
        this.dockerOutput = element.output
      }
    }
  }

  deleteDockerInstance(id)
  {
    this.apiService.deleteDockerInstance(id).subscribe(data=>{
      for (let index = 0; index < this.listItems.length; index++) {
        const element = this.listItems[index];
        if (element.id == id)
        {
          if (!element.done)
          {
            this.loading = false;
          }
          this.listItems = this.listItems.filter(function(item) {
            return item !== element
         })

        }
      }
    });
  }

  showConsole(id)
  {
    this.apiService.getDockerInstance(id).subscribe(data => {
        console.log("Show console of instance "+id+" is "+data.done)
        
        //this.output = data.console.join("\r\n")
        //this.getInstance(data.instance)
        try{
          this.subscription.unsubscribe();
        }
        catch{
          console.log("Unsubscribing")
        }
        
        if (data.done == true)
        {
          this.output = data.console.join("\r\n")
          this.setRunID(id)
          this.fetchMore(true)
        }
        else
        {
          //this.getInstance(data.instance)
          this.updateConsole(id)
        }
    });
  }

  // scrollLogToBottom() {
  //     let logTa = document.getElementsByClassName("CodeMirror")[0]
  //     logTa.scrollTop = logTa.scrollHeight;
  // }

  getInstance(id) {
    this.apiService.getInstance(id).subscribe(data => {
      this.apiService.getBlock(data.block).subscribe(block=>{
        data.parameters = data.parameters.map(param=>Object.assign({"type":"text"},param))
        data.shared = data.shared.map(param=>Object.assign({"type":"text"},param))
        data.booleans = data.booleans.map(param=>Object.assign({"type":"checkbox"},param))
        data.multis = data.multis.map(param=>Object.assign({"type":"multi","choices":block.multis.filter(m=>m.key==param.key)[0].value},param))
        console.log(data.multis)
        this.Instance = data
      })

        // this.dataSource = new MatTableDataSource([this.Instance]);

        // console.log(this.dataSource)
    });
    
  }

  fetchMore(zero): void {
    if (zero == true)
    {
      this.listItems = [];
      this.alreadyLoaded=0
    }
      this.loading = true;
      this.apiService.getDockerInstanceByInstanceID(this.id).subscribe(data => {
      
        if (this.alreadyLoaded <= data.length)
        {
          
          const imageList = {"true": "fail.png","false": "success.png"};
          const doneList = {"true": "Fail","false": "Success"};

          //const newItems = [];
    
            for (let i = 0; i < 15; i++) {
        
              if (data.length == this.alreadyLoaded+i)
              {
                //this.loading = false;
                //this.listItems = [...this.listItems, ...newItems];
                break
            
              }

              let imageToShow = "../../assets/loading.gif"
              let content = "Running..."
              if (data[this.alreadyLoaded+i].done == true)
              {
                imageToShow = `../../assets/${imageList[data[this.alreadyLoaded+i].error.toString()]}`
                content = doneList[data[this.alreadyLoaded+i].error.toString()]
              }
              let runtime = []
              for (var key in data[this.alreadyLoaded+i].runtime) {
                if (data[this.alreadyLoaded+i].runtime.hasOwnProperty(key)) {
                  runtime.push(key[0].toUpperCase()+":"+data[this.alreadyLoaded+i].runtime[key])
                }
              }
              this.listItems.push({
                id: data[this.alreadyLoaded+i]._id,
                run_number: data.length-(this.alreadyLoaded+i),
                artifacts: data[this.alreadyLoaded+i].artifacts,
                title: `${data.length-(this.alreadyLoaded+i)}`,
                content: content,
                runtime: runtime,
                output: data[this.alreadyLoaded+i].output,
                done: data[this.alreadyLoaded+i].done,
                image: imageToShow,
              createdAt: data[this.alreadyLoaded+i].createdAt
              });
      
              
            }
            this.alreadyLoaded+=15
            this.listItems = [...this.listItems];
            this.loading = false;
        }
        else
        {
          this.loading = false;
        }
      });
  }

  fetchMoreInit(): void {
  

    this.loading = true;
    this.apiService.getDockerInstanceByInstanceID(this.id).subscribe(data => {
      this.showConsole(this.run == null ? data[0]._id: this.run)
      if (this.alreadyLoaded <= data.length)
      {
        
        const imageList = {"true": "fail.png","false": "success.png"};
        const doneList = {"true": "Fail","false": "Success"};

        //const newItems = [];
  
          for (let i = 0; i < (this.run == null ? 15 : data.length); i++) {
      
            if (data.length == this.alreadyLoaded+i)
            {
              //this.loading = false;
              //this.listItems = [...this.listItems, ...newItems];
              break
          
            }
              
         

            let imageToShow = "../../assets/loading.gif"
            let content = "Running..."
            if (data[this.alreadyLoaded+i].done == true)
            {
              imageToShow = `../../assets/${imageList[data[this.alreadyLoaded+i].error.toString()]}`
              content = doneList[data[this.alreadyLoaded+i].error.toString()]
            }
            let runtime = []
            for (var key in data[this.alreadyLoaded+i].runtime) {
              if (data[this.alreadyLoaded+i].runtime.hasOwnProperty(key)) {
                runtime.push(key[0].toUpperCase()+":"+data[this.alreadyLoaded+i].runtime[key])
              }
            }
            this.listItems.push({
              id: data[this.alreadyLoaded+i]._id,
              artifacts: data[this.alreadyLoaded+i].artifacts,
              run_number: data.length-(this.alreadyLoaded+i),
              title: `${data.length-(this.alreadyLoaded+i)}`,
              content: content,
              runtime: runtime,
              output: data[this.alreadyLoaded+i].output,
              done: data[this.alreadyLoaded+i].done,
              image: imageToShow,
              createdAt: data[this.alreadyLoaded+i].createdAt
            });
            
    
            
          }
          this.alreadyLoaded+=15
          this.listItems = [...this.listItems];
          this.loading = false;
      }
      else
      {
        this.loading = false;

      }
      this.listItems.slice().reverse().forEach(element => {
        if (element.content == "Running..."){
          this.showConsole(element.id)
        }
      });
      
    });
  }




  codeMirrorFullScreen(CodeMirror) {
    "use strict";
  
    CodeMirror.defineOption("fullScreen", false, function(cm, val, old) {
      if (old == CodeMirror.Init) old = false;
      if (!old == !val) return;
      if (val) setFullscreen(cm);
      else setNormal(cm);
    });
  
    function setFullscreen(cm) {
      var wrap = cm.getWrapperElement();
      cm.state.fullScreenRestore = {scrollTop: window.pageYOffset, scrollLeft: window.pageXOffset,
                                    width: wrap.style.width, height: wrap.style.height};
      wrap.style.width = "";
      wrap.style.height = "auto";
      wrap.className += " CodeMirror-fullscreen";
      document.documentElement.style.overflow = "hidden";
      cm.refresh();
    }
  
    function setNormal(cm) {
      var wrap = cm.getWrapperElement();
      wrap.className = wrap.className.replace(/\s*CodeMirror-fullscreen\b/, "");
      document.documentElement.style.overflow = "";
      var info = cm.state.fullScreenRestore;
      wrap.style.width = info.width; wrap.style.height = info.height;
      window.scrollTo(info.scrollLeft, info.scrollTop);
      cm.refresh();
    }
  }

  

  
}
