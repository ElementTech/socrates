import { Layout, Edge, Node } from '@swimlane/ngx-graph';
import { DagreNodesOnlyLayout } from './customDagreNodesOnly';
import { stepRound } from './customStepCurved';
import { CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit,NgZone, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FileUploadService } from 'src/app/service/file-upload.service';
import { SidenavService } from 'src/app/service/sidenav.service';
import { ApiService } from '../../service/api.service';
@Component({
  selector: 'flow-viz',
  styleUrls: ['./flow-viz.component.css'],
  templateUrl: './flow-viz.component.html'
})
export class FlowVizComponent {
  public curve: any = stepRound;
  public layout: Layout = new DagreNodesOnlyLayout();
  public links: Edge[] = [
    {
      id: 'a',
      source: '1',
      target: '2',
      label: 'is parent of'
    },
    {
      id: 'b',
      source: '1',
      target: '3',
      label: 'custom label'
    },
    {
      id: 'c',
      source: '1',
      target: '4',
      label: 'custom label'
    }
  ];
  public nodes: Node[] = [
    {
      id: '1',
      label: 'A'
    },
    {
      id: '2',
      label: 'B'
    },
    {
      id: '3',
      label: 'C'
    },
    {
      id: '4',
      label: 'D'
    }
  ];


  onNodeClick(event){
    console.log(event)
  }
  onNodeDblClick(event){
    console.log(event)
  }
  onPlusClick(event){
    const id = event.id.split("_").slice(1).join("_")
    const num = btoa(Math.random().toString()).substr(10, 5);

    this.nodes.push({id:`${num}_${id}`,label:num})

    this.nodes.push({id:`plus_${num}_${id}`,label:"+"})

    this.nodes = [...this.nodes];

    this.links.push({
      id:`${num}_${id}`,
      source: id,
      target: `${num}_${id}`,
      label: num
    })

    this.links.push({
      id:`plus_${num}_${id}`,
      source: `${num}_${id}`,
      target: `plus_${num}_${id}`,
      label: '+'
    })

    console.log(`Pushing Node ${num}_${id} to be connected to ${id}. Giving it plus_${num}_${id}, it will be connected to ${num}_${id}`)

    this.links = [...this.links];
  }

  // Flow Create


  flowForm: FormGroup;
  Images?: Observable<any>;
  imageUrls = {};
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
  }
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (event.previousContainer.id != "initial-list")
      {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
      }
      else
      {
        copyArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
      }
    }
    this.flowForm.get('steps').setValue(this.steps)
  }
  ngOnInit(): void {
    this.nodes.forEach(node=>{
      this.nodes.push({id:`plus_${node.id}`,label:"+"})
      this.nodes = [...this.nodes];
      this.links.push({
        id:`plus_${node.id}`,
        source: node.id,
        target: `plus_${node.id}`,
        label: '+'
      })
      this.links = [...this.links];
    })
    // this.sidenav.close();
    this.Images = this.uploadService.getFiles()
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
    this.mainForm()
    this.id = this.actRoute.snapshot.paramMap.get('id')
    if (this.id == ""){
      console.log("New Flow")
    }
    else
    {
      console.log("Populate Flow")
      this.apiService.getFlow(this.id).subscribe(data => {
        delete data.__v
        delete data._id
        this.flowForm.setValue(data)
        this.steps= data.steps.map(step=>step.map(inst=>JSON.parse(inst).data))
        console.log(this.steps)
      });
    }
  }
  addItems(startIndex, endIndex, _method) {

    this.apiService.getInstances().subscribe((data) => {
      this.data=data
      for (let i = startIndex; i < endIndex && i < this.data.length; ++i) {
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
            if (error.includes("Error Code: 400")){
              this._snackBar.open('Duplicate Names Not Allowed', 'Close', {
                duration: 3000
              });
            }
          });
      }
      else
      { 
        this.apiService.updateFlow(this.id,Object.assign({}, this.flowForm.value, {steps: this.flowForm.value.steps.map(step=>{return step.map(inst=>{
          console.log(inst)
          if (typeof inst == "string")
          {
            return {"num":JSON.parse(inst).num,"id":JSON.parse(inst).data._id} 
          }
          else
          {
            return {"num":step.indexOf(inst),"id":inst._id} 
          }
        })})})).subscribe(
          (res) => {
            this._snackBar.open('Flow updated successfully', 'Close', {
              duration: 3000
            });
            console.log(res)
            this.ngZone.run(() => this.router.navigateByUrl('/flow-list'))
          }, (error) => {
            if (error.includes("Error Code: 400")){
              this._snackBar.open('Duplicate Names Not Allowed', 'Close', {
                duration: 3000
              });
            }
          });
      }

    }
  }

}