import { CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit,NgZone, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DagreNodesOnlyLayout, Layout } from '@swimlane/ngx-graph';
import { interval, map, Observable, switchMap, tap } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import {FileUploadService} from '../../../services/file-upload.service'
import { stepRound } from './customStepCurved';

@Component({
  selector: 'app-flow-viz-run',
  templateUrl: './flow-viz-run.component.html',
  styleUrls: ['./flow-viz-run.component.css']
})
export class FlowvizRunComponent implements OnInit {

  loading: boolean = false;
  listItems = [];
  alreadyLoaded=0;
  fetchedLatestRun = false;
  SubscribeNow = true;
  flowForm: FormGroup;
  array = [];
  steps: any = [[]];
  id: any = "";
  sum = 15;
  data: any;
  throttle = 300;
  scrollDistance = 1.5;
  scrollUpDistance = 2;
  direction = "";
  submitted: boolean;
  subscription: any;
  output: String = "";
  runNumber: any;

  Images?: Observable<any>;
  imageUrls = {};
  flowData: any;
  constructor(  
    private sanitizer: DomSanitizer,
    private uploadService: FileUploadService,
    public fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private router: Router,
    private actRoute: ActivatedRoute,
    private ngZone: NgZone,
    private cdRef: ChangeDetectorRef,
    private apiService: ApiService
    ) {
    this.appendItems(0, this.sum);
    this.uploadService.getFiles().subscribe(data=>{
      
      data.forEach(element => {
        this.uploadService.getFileImage(element.name).subscribe(data => {
            let unsafeImageUrl = URL.createObjectURL(data);
            this.imageUrls[element.name]= this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
        }, error => {
            console.log(error);
        });
      });

    })
  }


  fetchMoreInit(): void {
  

    this.loading = true;
    this.apiService.getFlowvizInstanceByFlowvizID(this.id).subscribe(data => {
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
            this.showConsole(data[0]._id)

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
              title: `${data.length-(this.alreadyLoaded+i)}`,
              content: content,
              runtime: runtime,
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
  showConsole(id)
  {
    // this.fetchMore(true)
    this.apiService.getFlowvizInstance(id).subscribe(data => {
        console.log("Show console of instance "+id+" is "+data.done)
        
        //this.output = data.console.join("\r\n")
        this.paintSteps(data)
        //this.getInstance(data.instance)
        try{
          this.subscription.unsubscribe();
        }
        catch{
          console.log("Unsubscribing")
        }
        
        if (data.done == true)
        {
          this.fetchMore(true)
          this.setRunID(id)
        }
        else
        {
          //this.getInstance(data.instance)
          this.updateConsole(id)
        }
    });
  }


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

  deleteFlowvizInstance(id)
  {
    this.apiService.deleteFlowvizInstance(id).subscribe(data=>{
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

  // ngAfterViewChecked() { 
  //   if (document.querySelector<HTMLElement>('.CodeMirror') != null)
  //   {
  //     if (document.querySelector<HTMLElement>('.CodeMirror').style.getPropertyValue('height') != "79vh")
  //     {
  //       document.querySelector<HTMLElement>('.CodeMirror').style.setProperty('height', '79vh');
  //     }
  //   }
    

   
  // }// Good
  ani() {
    document.getElementById('play-btn').classList.add("play-btn-animate");
    this._snackBar.open('Flowviz Started', 'Close', {
      duration: 3000
    });
    this.runFlowviz(this.id)
  }// Good  


  runFlowviz(id) {
    // this.unPaintSteps()
      try{
        this.subscription.unsubscribe();
      }
      catch{
        console.log("Unsubscribing")
      }
      this.apiService.runFlowviz({id}).subscribe(
        (res) => {
        
          this._snackBar.open('Flow Run Started', 'Close', {
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
      }
    }
  }

  updateConsole(run_id)
  {
    
    let updatedInList = false
    this.subscription = interval(1000)
    .pipe(
        switchMap(() => this.apiService.getFlowvizInstance(run_id)),
        map(response => {
          this.setRunID(run_id)
          if (Object.keys(response ? response : []).length == 0)
          {
            return true;
          }
          else
          {
            this.paintSteps(response)
            if (updatedInList == false)
            {
              this.fetchMore(true)
              updatedInList = true
            }
      
            for (let index = 0; index < this.listItems.length; index++) {
              const element = this.listItems[index];
              if (element.id == run_id)
              {
                let runtime = []
                for (var key in response.runtime) {
                    runtime.push(key[0].toUpperCase()+":"+response.runtime[key])
                }
                this.listItems[index].runtime = runtime
              }
              else
              {
                if ((element.content == "Running...") && (element.id != run_id))
                {
                  let runtime = []
                  this.apiService.getFlowvizInstance(element.id).subscribe(data => {
                
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
    
            //this.output=response.console.join("\r\n")
            

            if(!response.done) 
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

  paintSteps(flowRun){
    this.nodes = flowRun.nodes
    console.log(this.nodes)
    this.nodes=[...this.nodes]
  }

  // paintSteps(flowRun) {
  //   const runs = []; 
  //   const runResults = [];
  //   for (let index = 0; index < flowRun.run.length; index++) {
  //     const step = flowRun.run[index];

  //     for (let indexj = 0; indexj < step.length; indexj++) {
  //       console.log("I am now at" + step[indexj].id+index.toString()+indexj.toString())
        
  //       runs.push(this.apiService.getDockerInstance(step[indexj].run_id).pipe(tap(data=>{runResults.push({"id":step[indexj].id+index.toString()+indexj.toString(),"done":data.done,"error":data.error})})).toPromise());
  //     }

  //   }
  //   Promise.all(runs).then(promiseResult => runResults.forEach(data => {
  //     console.log(data)
    
  //     if (data.done){
  //       if (data.error){
  //         document.getElementById(data.id).classList.remove("blob");
  //         document.getElementById(data.id).style.backgroundColor = "lightcoral";
  //       }
  //       else
  //       {
  //         document.getElementById(data.id).classList.remove("blob");
  //         document.getElementById(data.id).style.backgroundColor = "lightgreen";
  //       }
  //     }
  //     else
  //     {
  //       document.getElementById(data.id).classList.add("blob");
  //     }
  //   }));
  //  }
 


  unPaintSteps(){
    this.nodes = this.flowData
  }


  fetchMore(zero): void {
    if (zero == true)
    {
      this.listItems = [];
      this.alreadyLoaded=0
    }
      this.loading = true;
      this.apiService.getFlowvizInstanceByFlowvizID(this.id).subscribe(data => {
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
                title: `${data.length-(this.alreadyLoaded+i)}`,
                content: content,
                runtime: runtime,
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


  addItems(startIndex, endIndex, _method) {

    this.apiService.getInstances().subscribe((data) => {
      this.data = data;
      for (let i = 0; i < this.sum && i < this.data.length; ++i) {
        this.array[_method](data[i]);
       
      }
    })

    
  }

  appendItems(startIndex, endIndex) {
    this.addItems(startIndex, endIndex, "push");
  }

  prependItems(startIndex, endIndex) {
    this.addItems(startIndex, endIndex, "unshift");
  }

  onScrollDown(ev) {
    // add another 20 items
    const start = this.sum;
    this.sum += 20;
    this.appendItems(start, this.sum);

    this.direction = "down";
  }

  onUp(ev) {
    const start = this.sum;
    this.sum += 20;
    this.prependItems(start, this.sum);
    this.direction = "up";
  }
  // generateWord() {
  //   return "bla";
  // }
  // ngAfterViewChecked() {
  //   this.cdRef.detectChanges();
  // }
  addStep(){
    this.steps.push([])
    this.flowForm.get("steps").setValue(this.steps);
    // this.cdRef.detectChanges();
  }



  validateArray(arr){
    let result = true
    arr.forEach(element => {
      if (element.length == 0)
      {
        this._snackBar.open('Flowviz steps cannot be empty', 'Close', {
          duration: 3000
        });
        result = false
      }
    });
    return result
  }

  // validateSteps(c: FormControl) {
  //     return this.validateArray(c.value) ? null : {
  //     validateSteps: {
  //       valid: false
  //     }
  //   };
  // }


  get myForm(){
    return this.flowForm.controls;
  }


  public curve: any = stepRound;
  public layout: Layout = new DagreNodesOnlyLayout();
  lastNum = 0
  public links: any[] = [
 
  ];
  public nodes: any[] = [
    {
      id: 'node0',
      label: 'Start'
    }
  ];


  onNodeClick(event){
    console.log(event)
  }
  onNodeDblClick(event){
    console.log(event)
  }


  // Flow Create



 

  instances: any;

  inputChanged(event,nodeObject){
    console.log(event.value,nodeObject)
    nodeObject.data.name = event.value
    nodeObject.data.image = this.instanceList.find(inst=>inst.name==event.value).image
    // document.querySelector(`img[id=img${nodeObject.label}]`).setAttribute("src",this.imageUrls[this.instanceList.find(inst=>inst.name==event.option.value).image])
    this.nodes[this.nodes.indexOf(nodeObject)] = nodeObject
    this.flowForm.get("nodes").setValue(this.nodes)
  }
  enter(i) {
    document.getElementById(i.label+"rect").setAttribute("filter","url(#neon)")
  }

  leave(i) {
    document.getElementById(i.label+"rect").removeAttribute("filter")
  }

  ngOnInit(): void {

    // this.showPlus()
    // this.sidenav.close();
    this.Images = this.uploadService.getFiles()

    this.mainForm()
    this.id = this.actRoute.snapshot.paramMap.get('id')
    this.fetchMoreInit()

    console.log("Populate Flow")
    this.apiService.getFlowviz(this.id).subscribe(data => {
      this.flowData=data
      delete data.__v
      delete data._id
      this.nodes = data.nodes
      this.nodes = [...this.nodes]
      this.links = data.links
      this.links = [...this.links]
      this.flowForm.setValue(data)
      this.lastNum = parseInt(data.nodes.reduce((prev, current)=> ( (parseInt(prev.id)  > parseInt(current.id)) ? prev : current),0).label)
    })

  }
  instanceList: any;


  // generateWord() {
  //   return "bla";
  // }
  // ngAfterViewChecked() {
  //   this.cdRef.detectChanges();
  // }


  mainForm() {
    this.flowForm = this.fb.group({
      name: ['', [Validators.required]],
      nodes: [this.nodes, [Validators.required]],
      links: [this.links, [Validators.required]],
      on_error: ['', [Validators.required]],
      desc: [''],
      createdAt: [''],
      updatedAt: [''],
      image: ['']
    })
  }


  // validateSteps(c: FormControl) {
  //     return this.validateArray(c.value) ? null : {
  //     validateSteps: {
  //       valid: false
  //     }
  //   };
  // }






}
