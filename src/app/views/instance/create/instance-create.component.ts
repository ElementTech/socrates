import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, NgZone, ViewEncapsulation,ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { FormArray } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Block } from 'src/app/model/Block';

import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '../../../services/api.service';
import {FileUploadService} from '../../../services/file-upload.service'
import { interval, map, Observable, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import {v4 as uuidv4} from 'uuid';
@Component({
  selector: 'app-instance-create',
  templateUrl: './instance-create.component.html',
  styleUrls: ['./instance-create.component.css'],
  encapsulation: ViewEncapsulation.None,

})

export class InstanceCreateComponent implements OnInit {  
  
  
  Block:any = [];
  Images?: Observable<any>;
  imageUrls = {};
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['name', 'lang','parameters'];
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
  booleans: FormArray;
  multis: FormArray;
  multisOptions: Array<any>;
  dynamic: FormArray;
  dynamicOptions: Array<any>;
  constructor(
    private sanitizer: DomSanitizer,
    private uploadService: FileUploadService,
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private _snackBar: MatSnackBar,
    private apiService: ApiService,
    private actRoute: ActivatedRoute,
    private cd: ChangeDetectorRef
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
        this.instanceForm.get('image').setValue(data.image)

        this.apiService.getBlock(data.block).subscribe(block=>{
          this.multisOptions=block.multis
        })
        this.dynamicOptions=[]

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

        this.dynamic = this.instanceForm.get('dynamic') as FormArray;

        this.dynamicOptions = data.dynamic.map(d=>{delete d.output;return d})
        for (let index = 0; index < data.dynamic.length; index++) {
          const element = data.dynamic[index];
          this.dynamic.push(this.fb.group({
            name: element.name,
            output: []
          }))
    
          this.createDynamicKeyValue(element.name).then((resolved)=>{
            // console.log(this.instanceForm,index,resolved)
            //@ts-ignore
            for (let control of this.dynamic['controls']) {
              //@ts-ignore
              if (control.controls.name.value == element.name)
              {
                this.dynamicOptions = this.dynamicOptions.map(obj=>{
                  console.log(obj.name,element.name)
                  if (obj.name==element.name)
                  {
                    console.log("returning")
                    return Object.assign({"output":resolved},obj)
                  }
                  else
                  {
                    return obj
                  }
                })
                control.get("output").setValue(resolved)
              }
           }
    
            console.log(resolved)
            // this.dynamic.push(resolved)
          })
          this.paramCount+=1
        }
    

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
      dynamic: this.fb.array([
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
  createDynamicKeyValue(name): any {
    
    return new Promise(resolve=>{
      this.apiService.getDynamicParameters().subscribe(params=>{
        // @ts-ignore
        const chosenParam = params.filter(param=>param.name==name)[0]


        let output = []

        this.apiService.runDynamicParameter({"id":chosenParam._id,"script":chosenParam.script,"lang":chosenParam.lang}).subscribe(run_id=>{
          let subscription = interval(500)
          .pipe(
              switchMap(() => this.apiService.getDockerInstance(run_id)),
              map(response => {
                if (Object.keys(response ? response : []).length == 0)
                {
                  return true;
                }
                else
                {
    
                  output = response.output[0] ? response.output[0].value.replaceAll('[','').replaceAll(']','').replace(/['"]+/g, '').split(',') : []
      
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
              subscription.unsubscribe();
              console.log("done");
              // @ts-ignore

              resolve(output)
    
             }
          });
        })
      })
    })
   
  }
  addItem(): void {
    this.parameters = this.instanceForm.get('parameters') as FormArray;
    this.parameters.push(this.createItem());
  }
  removeItem(index): void {
    this.parameters.removeAt(index)
    
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
    row = row.value
    this.parameters = this.instanceForm.get('parameters') as FormArray;
    this.parameters.clear()
    this.shared = this.instanceForm.get('shared') as FormArray;
    this.shared.clear()
    this.booleans = this.instanceForm.get('booleans') as FormArray;
    this.booleans.clear()
    this.multis = this.instanceForm.get('multis') as FormArray;
    this.multis.clear()
    this.dynamic = this.instanceForm.get('dynamic') as FormArray;
    this.dynamic.clear()
    this.paramCount = 0
    this.clickedRows = row;

    this.isDisabled = false;

    this.instanceForm.get('block').setValue(row._id);
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
    this.dynamicOptions = row.dynamic
    for (let index = 0; index < row.dynamic.length; index++) {
      const element = row.dynamic[index];
      this.dynamic.push(this.fb.group({
        name: element.name,
        output: []
      }))

      this.createDynamicKeyValue(element.name).then((resolved)=>{
        // console.log(this.instanceForm,index,resolved)
        //@ts-ignore
        for (let control of this.instanceForm.get('dynamic')['controls']) {
          if (control.controls.name.value == element.name)
          {
            this.dynamicOptions = this.dynamicOptions.map(obj=>{
              if (obj.name==element.name)
              {
                return Object.assign({"output":resolved},obj)
              }
              else
              {
                return obj
              }
            })
            control.get("output").setValue(resolved)
          }
       }

        console.log(resolved)
        // this.dynamic.push(resolved)
      })
      this.paramCount+=1
    }

  }

  onSubmit() {
    
    this.submitted = true;
    if (!this.instanceForm.valid) {
      this._snackBar.open('Instance Form Invalid', 'Close', {
        duration: 3000
      });
    } else {

      if (this.id == "")
      {
        const CUSTOM_ID = uuidv4().replace(/-/g, "").substring(0,24)
        this.apiService.createInstance(Object.assign(this.instanceForm.value,{"_id":CUSTOM_ID})).subscribe(
          (res) => {
            console.log(this.instanceForm.value)
            console.log('Instance successfully created!')
            this.ngZone.run(() => this.router.navigateByUrl('/instance/run/'+CUSTOM_ID))
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
        this.apiService.updateInstance(this.id,this.instanceForm.value).subscribe(
          (res) => {
            console.log(res)
            this.ngZone.run(() => this.router.navigateByUrl('/instance/list'))
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
  selectedBlock: any;
  selectedImage: any;

  readBlock(){
    this.apiService.getBlocks().subscribe((data) => {
     this.Block = data;
     this.dataSource = new MatTableDataSource(this.Block.reverse());
     this.dataSource.paginator = this.paginator;
     this.dataSource.sort = this.sort;
  
    })    
  }
  

}

