import { CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit,NgZone, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import {FileUploadService} from '../../../services/file-upload.service'
import {v4 as uuidv4} from 'uuid';
@Component({
  selector: 'app-flow-create',
  templateUrl: './flow-create.component.html',
  styleUrls: ['./flow-create.component.css']
})
export class FlowCreateComponent implements OnInit {

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
  selectedImage: any;
  error_option = "";
  error_options = [{label: 'Continue', value: 'continue',icon: 'pi pi-fast-forward'},
  {label: 'Stop', value: 'stop',icon:'pi pi-filter-slash'}]
 
  constructor(  
    private sanitizer: DomSanitizer,
    private uploadService: FileUploadService,
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
    console.log(event.previousContainer.data,event.container.data)
    this.flowForm.get('steps').setValue(this.steps)
  }
  ngOnInit(): void {
    this.apiService.getInstances().subscribe((data) => {
      this.array=data
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
        this.flowForm.setValue(Object.assign(data,{image:(data.image ? data.image : ''),user:(data.user ? data.user : '')}))
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
  removeStep(i)
  {
    this.steps.splice(i,1)
    this.flowForm.get("steps").setValue(this.steps);
  }


  mainForm() {
    this.flowForm = this.fb.group({
      name: ['', [Validators.required]],
      steps: [this.steps, [Validators.required]],
      on_error: ['', [Validators.required]],
      desc: [''],
      createdAt: [''],
      updatedAt: [''],
      user: [''],
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
      
      this._snackBar.open('Flow Form Invalid', 'Close', {
        duration: 3000
      });
    } else {
      if (this.id == "")
      {
        const CUSTOM_ID = uuidv4().replace(/-/g, "").substring(0,24)
        this.apiService.createFlow(Object.assign(this.flowForm.value,{"_id":CUSTOM_ID})).subscribe(
          (res) => {
            this._snackBar.open('Flow created successfully', 'Close', {
              duration: 3000
            });
            this.ngZone.run(() => this.router.navigateByUrl('/step/run/'+CUSTOM_ID))
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
            this.ngZone.run(() => this.router.navigateByUrl('/step/list'))
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
