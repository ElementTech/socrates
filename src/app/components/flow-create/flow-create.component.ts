import { CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit,NgZone, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SidenavService } from 'src/app/service/sidenav.service';
import { ApiService } from '../../service/api.service';
@Component({
  selector: 'app-flow-create',
  templateUrl: './flow-create.component.html',
  styleUrls: ['./flow-create.component.css']
})
export class FlowCreateComponent implements OnInit {

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

  ngOnInit(): void {
    // this.sidenav.close();
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
        data.steps = data.steps.map(step=>step.map(inst=>JSON.parse(inst).data))
        this.flowForm.setValue(data)
        this.steps=data.steps
        console.log(this.steps)
      });
    }
  }
  constructor(  
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
      desc: ['']
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
        console.log(this.id,this.flowForm.value)
        this.apiService.updateFlow(this.id,this.flowForm.value).subscribe(
          (res) => {
            this._snackBar.open('Flow updated successfully', 'Close', {
              duration: 3000
            });
            console.log(res)
            this.ngZone.run(() => this.router.navigateByUrl('/flow-list'))
          }, (error) => {
            console.log(error);
          });
      }

    }
  }

}
