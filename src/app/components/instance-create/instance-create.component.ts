import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { Component, OnInit, NgZone, ViewEncapsulation,ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FormArray } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Block } from 'src/app/model/Block';
import { MatStepper } from '@angular/material/stepper';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { DomSanitizer } from '@angular/platform-browser';
import { FileUploadService } from 'src/app/service/file-upload.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-instance-create',
  templateUrl: './instance-create.component.html',
  styleUrls: ['./instance-create.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ]
})

export class InstanceCreateComponent implements OnInit {  
  
  
  Block:any = [];
  Images?: Observable<any>;
  imageUrls = {};
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['name', 'lang','parameters','desc'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  clickedRows = Block;
  paramCount = 0;
  isLinear = false;
  isDisabled = true;
  @ViewChild('CodeMirror') private cm: any;
  submitted = false;
  instanceForm: FormGroup;
  parameters: FormArray;

  
  title = "New Instance"
  shared: FormArray;
  id = "";
  @ViewChild('stepper') stepper: MatStepper;
  booleans: FormArray;
  multis: FormArray;
  multisOptions: Array<any>;
  constructor(
    private sanitizer: DomSanitizer,
    private uploadService: FileUploadService,
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService,
    private actRoute: ActivatedRoute
  ) { 
    this.mainForm();
    this.readBlock();
    this.id = this.actRoute.snapshot.paramMap.get('id')
    if (this.id == ""){
      console.log("New Flow")
    }
    else
    {
      console.log(this.id)
      this.apiService.getInstance(this.id).subscribe(data => {
        delete data.__v
        delete data._id
        console.log(data)

        this.instanceForm.get('name').setValue(data.name)
        this.instanceForm.get('desc').setValue(data.desc)
        this.instanceForm.get('block').setValue(data.block)
        this.shared = this.instanceForm.get('shared') as FormArray;
        data.shared.forEach(item=>{
          console.log(item)
          this.shared.push(this.fb.group({
            key: item.key,
            value: item.value,
            secret: item.secret,
            _id: item._id
          }));
        });
        this.parameters = this.instanceForm.get('parameters') as FormArray;
        data.parameters.forEach(item=>{
          console.log(item)
          this.parameters.push(this.fb.group({
            key: item.key,
            value: item.value,
            secret: item.secret
          }));
        });

        this.multis = this.instanceForm.get('multis') as FormArray;
        this.multisOptions = data.multis
        data.multis.forEach(item=>{
          this.multis.push(this.fb.group({
            key: item.key,
            value: item.value
          }));
        });
        this.booleans = this.instanceForm.get('booleans') as FormArray;
        data.booleans.forEach(item=>{
          this.booleans.push(this.fb.group({
            key: item.key,
            value: item.value
          }));
        });
      });
      

    }
  }


  ngOnInit() { 
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
  //  this.apiService.getLangs().subscribe(
  //     (res) => {
  //       res = JSON.parse(res.toString())
  //       for (let key in res) {
  //         let value = res[key];
  //         console.log(value["ProgrammingLanguage"])

  //       }
  //     }, (error) => {
  //       console.log(error);
  //     })

  }


  mainForm() {
    this.instanceForm = this.fb.group({
      name: ['', [Validators.required]],
      //email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      parameters: this.fb.array([
      ]),
      shared: this.fb.array([
      ]),
      booleans: this.fb.array([
      ]),
      multis: this.fb.array([
      ]),
      desc: [''],
      image: [''],
      block: ['',[Validators.required]]
    })
  }

  // Choose designation with select dropdown
  // updateProfile(e){
  //   this.instanceForm.get('designation').setValue(e, {
  //     onlySelf: true
  //   })
  // }

  // Getter to access form control
  get myForm(){
    return this.instanceForm.controls;
  }

  createItem(): FormGroup {
    return this.fb.group({
      key: '',
      value: '',
      secret: false,
    });
  }
  createItemKeyValue(key,value,secret): FormGroup {
    return this.fb.group({
      key: key,
      value: value,
      secret: secret
    });
  }
  createBooleanKeyValue(key,value): FormGroup {
    return this.fb.group({
      key: key,
      value: value
    });
  }
  createMultisKeyValue(key,value): FormGroup {
    return this.fb.group({
      key: key,
      value: value
    });
  }
  addItem(): void {
    this.parameters = this.instanceForm.get('parameters') as FormArray;
    this.parameters.push(this.createItem());
  }
  removeItem(index): void {
    this.parameters.removeAt(index)
    
  }
  ngAfterViewInit(){
    if (this.id != "")
    {
      this.stepper.next()
    }
  }
  ngAfterViewChecked(){
    for (let index = 0; index < this.instanceForm.get("parameters").value.length; index++) {
      let element = this.instanceForm.get("parameters").value[index];
      this.togglePass(index,element.secret)
    }
    for (let index = 0; index < this.instanceForm.get("shared").value.length; index++) {
      let element = this.instanceForm.get("shared").value[index];
      this.togglePass(index+'shared',element.secret)
    }
  }
  togglePass(i,checkbox) {
    try {
      if (checkbox)
      {
        document.getElementById(i).setAttribute("type","password");
      }
      else
      {
        document.getElementById(i).setAttribute("type","text");
      }
    } catch (error) {
      
    }

  }

  onClickRow(row){
    this.parameters = this.instanceForm.get('parameters') as FormArray;
    this.parameters.clear()
    this.shared = this.instanceForm.get('shared') as FormArray;
    this.shared.clear()
    this.booleans = this.instanceForm.get('booleans') as FormArray;
    this.booleans.clear()
    this.multis = this.instanceForm.get('multis') as FormArray;
    this.multis.clear()
    this.paramCount = 0
    this.clickedRows = row;

    this.isDisabled = false;

    this.instanceForm.get('block').setValue(row._id);
    this.stepper.next()
    row.parameters.forEach(element => {
      if (element)
      {
        if (element.key != ""){
          this.parameters.push(this.createItemKeyValue(element.key,element.value,element.secret));
          this.paramCount+=1
        } 
      }
    });
 
    row.shared.forEach(element => {
      if (element.key){
        this.shared.push(this.createItemKeyValue(element.key,element.value,element.secret));
        this.paramCount+=1
      } 
    });

    row.booleans.forEach(element => {
      if (element.key){
        this.booleans.push(this.createBooleanKeyValue(element.key,element.value));
        this.paramCount+=1
      } 
    });
    this.multisOptions = row.multis
    row.multis.forEach(element => {
      if (element.key){
        this.multis.push(this.createMultisKeyValue(element.key,element.value));
        this.paramCount+=1
      } 
    });


  }

  onSubmit() {
    
    this.submitted = true;
    if (!this.instanceForm.valid) {
      return false;
    } else {

      if (this.id == "")
      {
        this.apiService.createInstance(this.instanceForm.value).subscribe(
          (res) => {
            console.log(this.instanceForm.value)
            console.log('Instance successfully created!')
            this.ngZone.run(() => this.router.navigateByUrl('/instance-list'))
          }, (error) => {
            console.log(error);
          });
      }
      else
      {
        this.apiService.updateInstance(this.id,this.instanceForm.value).subscribe(
          (res) => {
            console.log(res)
            this.ngZone.run(() => this.router.navigateByUrl('/instance-list'))
          }, (error) => {
            console.log(error);
          });
      }
    }
  }


  readBlock(){
    this.apiService.getBlocks().subscribe((data) => {
     this.Block = data;
     this.dataSource = new MatTableDataSource(this.Block.reverse());
     this.dataSource.paginator = this.paginator;
     this.dataSource.sort = this.sort;
  
    })    
  }
  

}

