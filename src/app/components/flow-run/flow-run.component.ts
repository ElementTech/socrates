import { CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit,NgZone, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, map, Observable, switchMap, tap } from 'rxjs';
import { FileUploadService } from 'src/app/service/file-upload.service';
import { SidenavService } from 'src/app/service/sidenav.service';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-flow-run',
  templateUrl: './flow-run.component.html',
  styleUrls: ['./flow-run.component.css']
})
export class FlowRunComponent implements OnInit {

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

  ngOnInit(): void {
    this.mainForm();
    this.id = this.actRoute.snapshot.paramMap.get('id')
    this.fetchMoreInit();

    console.log("Populate Flow")
    this.apiService.getFlow(this.id).subscribe(data => {
      delete data.__v
      delete data._id
      data.steps = data.steps.map(step=>step.map(inst=>JSON.parse(inst).data))
      this.flowForm.setValue(data)
      this.steps=data.steps
      console.log(this.steps)
    });
  }
  Images?: Observable<any>;
  imageUrls = {};
  constructor(  
    private sanitizer: DomSanitizer,
    private uploadService: FileUploadService,
    private sidenav: SidenavService,
    public fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private router: Router,
    private actRoute: ActivatedRoute,
    private ngZone: NgZone,
    private cdRef: ChangeDetectorRef,
    private apiService: ApiService) {
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
    this.apiService.getFlowInstanceByFlowID(this.id).subscribe(data => {
    
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
              image: imageToShow
            });
            this.showConsole(data[this.alreadyLoaded+i]._id)
            
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
    this.unPaintSteps()
    // this.fetchMore(true)
    this.apiService.getFlowInstance(id).subscribe(data => {
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
          this.fetchMore(true)
          this.setRunID(id)
          this.paintSteps(data)
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
  }

  deleteFlowInstance(id)
  {
    this.apiService.deleteFlowInstance(id).subscribe(data=>{
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
    this._snackBar.open('Flow Started', 'Close', {
      duration: 3000
    });
    this.runFlow(this.id)
  }// Good  


  runFlow(id) {
    this.unPaintSteps()
      try{
        this.subscription.unsubscribe();
      }
      catch{
        console.log("Unsubscribing")
      }
      this.apiService.runFlow({id}).subscribe(
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
      }
    }
  }

  updateConsole(run_id)
  {
    
    let updatedInList = false
    this.subscription = interval(500)
    .pipe(
        switchMap(() => this.apiService.getFlowInstance(run_id)),
        map(response => {
          this.setRunID(run_id)
          if (Object.keys(response).length == 0)
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
                  this.apiService.getFlowInstance(element.id).subscribe(data => {
                
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
            this.paintSteps(response)

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

    flowRun.run.forEach(step=>{
      step.forEach(run => {
        this.apiService.getDockerInstance(run.run_id).subscribe(data=>{
          if (Object.keys(data).length != 0)
          {
            if (data.done){
              if (data.error){
                document.getElementById(run.id+run.ui_id).classList.remove("blob");
                document.getElementById(run.id+run.ui_id).style.backgroundColor = "lightcoral";
              }
              else
              {
                document.getElementById(run.id+run.ui_id).classList.remove("blob");
                document.getElementById(run.id+run.ui_id).style.backgroundColor = "lightgreen";
              }
            }
            else
            {
              document.getElementById(run.id+run.ui_id).classList.add("blob");
            }
          }
        })
      });
    })

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
    const elList = document.getElementsByClassName("example-box-horiz")
    for (var i = 0; i < elList.length; i++) {
      document.getElementById(elList[i].id).style.backgroundColor = "white"
      document.getElementById(elList[i].id).classList.remove("blob")
    }
  }


  fetchMore(zero): void {
    if (zero == true)
    {
      this.listItems = [];
      this.alreadyLoaded=0
    }
      this.loading = true;
      this.apiService.getFlowInstanceByFlowID(this.id).subscribe(data => {
      
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
                image: imageToShow
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


  mainForm() {
    this.flowForm = this.fb.group({
      name: ['', [Validators.required]],
      steps: [this.steps, [Validators.required]],
      desc: [''],
      image: ['']
    })
  }

  validateArray(arr){
    let result = true
    arr.forEach(element => {
      if (element.length == 0)
      {
        this._snackBar.open('Flow steps cannot be empty', 'Close', {
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

  onSubmit() {
    this.submitted = true;
    if (!this.flowForm.valid || (this.validateArray(this.flowForm.get('steps').value) == false)) {
      
      return false;
    } else {
      if (this.id == "")
      {
        this.apiService.createFlow(this.flowForm.value).subscribe(
          (res) => {
            this._snackBar.open('Flow created successfully', 'Close', {
              duration: 3000
            });
            this.ngZone.run(() => this.router.navigateByUrl('/flow-list'))
          }, (error) => {
            console.log(error);
          });
      }
      else
      {
        this.apiService.updateFlow(this.id,this.flowForm.value).subscribe(
          (res) => {
            this._snackBar.open('Flow updated successfully', 'Close', {
              duration: 3000
            });
            this.ngZone.run(() => this.router.navigateByUrl('/flow-list'))
          }, (error) => {
            console.log(error);
          });
      }

    }
  }

  fullScreenToggle = true;
  fullScreen(evt, input) {
      var code = evt.charCode || evt.keyCode;
      console.log("before")
      if (code == 27) {
        if (this.fullScreenToggle)
        {
          document.querySelector<HTMLElement>('.CodeMirror').style.setProperty('position','fixed')
          document.querySelector<HTMLElement>('.CodeMirror').style.setProperty('top','10vh')
          document.querySelector<HTMLElement>('.CodeMirror').style.setProperty('left','0')
          document.querySelector<HTMLElement>('.CodeMirror').style.setProperty('right','0')
          document.querySelector<HTMLElement>('.CodeMirror').style.setProperty('bottom','0')
          document.querySelector<HTMLElement>('.CodeMirror').style.setProperty('height','auto')
          document.querySelector<HTMLElement>('.CodeMirror').style.setProperty('z-index','9999')
          // this.sidenav.close();
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

}
