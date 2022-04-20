import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, NgZone, ViewEncapsulation,ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FormArray } from '@angular/forms';
import { CdkDragDrop, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatAccordion} from '@angular/material/expansion';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import {FileUploadService} from '../../../services/file-upload.service'
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-block-create',
  templateUrl: './block-create.component.html',
  styleUrls: ['./block-create.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ]
})

export class BlockCreateComponent implements OnInit {  
  
  prescript_enabled = false;
  isLinear = false;
  flowForm: FormGroup;
  array = [];
  steps: any = [[]];
  id: any = "";
  sum = 15;
  data: any;
  throttle = 300;
  githubList: any;
  scrollDistance = 1.5;
  scrollUpDistance = 2;
  direction = "";
  Images?: Observable<any>;
  imageUrls = {};



  sharedParams: any = [];
  dynamicParams: any = [];
  sharedBeforeForm: any = [];
  dynamicBeforeForm: any = [];
  shared: FormArray;
  dynamic: FormArray;
  selectedLintLang:String;

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('CodeMirror') private cm: any;
  submitted = false;
  blockForm: FormGroup;
  parameters: FormArray;
  selectedLang: String;
  editorOptions:any = {theme: 'vs-dark', language: "shell",automaticLayout: true,wordWrap: true};

  selectedImage: String;
  Language: Object[] = []
  title = "New Block"

  booleans: FormArray;
  multis: any;
  githubConnected: any;
  ngxOptions:Object= {
    lineNumbers: true,
    theme: 'material'
  }
  parametersForm: any;
  settingsLangs: any;

  constructor(
    private sanitizer: DomSanitizer,
    private uploadService: FileUploadService,
    public fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService,
    private actRoute: ActivatedRoute
  ) { 
   
  }
  onChange(event)
  {
    this.editorOptions = { ...this.editorOptions, language: event.target.value }; 
  }

  onLanguagePick(event)
  {
    this.editorOptions = { ...this.editorOptions, language: this.settingsLangs.filter(lang=>lang.lang==event.value)[0].syntax }; 
  }


  dropShared(event) {
    this.shared = this.blockForm.get('shared') as FormArray;
    event.items.forEach(element => {
      this.shared.push(this.fb.group({
        key: element.key,
        value: element.value,
        secret: element.secret,
      }));
    });
  }
  removeShared(event)
  {
    this.shared = this.blockForm.get('shared') as FormArray;
    event.items.forEach(element => {
      this.shared.removeAt(this.shared.value.findIndex(item => item.key === element.key))
    });
  }
  dropDynamic(event) {
    this.dynamic = this.blockForm.get('dynamic') as FormArray;
    event.items.forEach(element => {
      this.dynamic.push(this.fb.group({
        name: element.name,
      }));
    })
  }
  removeDynamic(event)
  {
    this.dynamic = this.blockForm.get('dynamic') as FormArray;
    event.items.forEach(element => {
      this.dynamic.removeAt(this.dynamic.value.findIndex(item => item.name === element.name))
    });
  }


  ngOnInit() { 

    this.apiService.getParameters().subscribe(data=>{
      this.sharedParams = data
    })
    this.apiService.getDynamicParameters().subscribe(data=>{
      this.dynamicParams = data
    })

    this.Images = this.uploadService.getFiles();
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
    this.mainForm();
    this.id = this.actRoute.snapshot.paramMap.get('id')
    this.apiService.getSettings().subscribe(settings=>{
      console.log(settings)
        this.githubConnected = (settings[0].github.length != 0) ? settings[0].github[0].githubConnected : false
        if (this.githubConnected){
          this.apiService.getGithubElements().subscribe(data=>{
            this.githubList = data.filter(item=>item['prefix']!=".yaml");
          });
        }
        if (this.id == ""){
          console.log("New Flow")
        }
        else
        {
          console.log("Populate Flow")
          this.apiService.getBlock(this.id).subscribe(data => {
            delete data.__v
            delete data._id
            this.blockForm.get('prescript').setValue(data.prescript)
            if (data.prescript == "false" || data.prescript == "")
            {
              this.prescript_enabled = false
            }
            else
            {
              this.prescript_enabled = true
            }
            this.blockForm.get('name').setValue(data.name)
            this.blockForm.get('script').setValue(data.script)
            this.blockForm.get('github').setValue(data.github)
            this.blockForm.get('desc').setValue(data.desc)
            this.blockForm.get('lang').setValue(data.lang)
            this.editorOptions = { ...this.editorOptions, language: data.lang }; 
            this.blockForm.get('image').setValue(data.image)
            this.shared = this.blockForm.get('shared') as FormArray;
            this.dynamic = this.blockForm.get('dynamic') as FormArray;
            this.sharedBeforeForm = data.shared
            data.shared.forEach(item=>{
              this.sharedParams = this.sharedParams.filter(el => el.key !== item.key)
              this.shared.push(this.fb.group({
                key: item.key,
                value: item.value,
                secret: item.secret,
                _id: item._id
              }));
            });
            this.dynamicBeforeForm = data.dynamic
            data.dynamic.forEach(item=>{
              this.dynamicParams = this.dynamicParams.filter(el => el.name !== item.name)
              this.dynamicParams.splice(this.dynamicParams.indexOf(item),1)
              this.dynamic.push(this.fb.group({
                name: item.name,
                _id: item._id
              }));
            });
    
            if (data.github && this.githubConnected){
              console.log(data,this.githubConnected)
              this.blockForm.get('github_path').setValue(data.github_path)
              this.connectGit(this.githubList.find(element => element.path == data.github_path))
              this.blockForm.get('script').setValue(atob(this.githubList.find(element => element.path == data.github_path).content))
            }
            this.parameters = this.blockForm.get('parameters') as FormArray;
            data.parameters.forEach(item=>{
              if (item.key != undefined)
              {
                this.parameters.push(this.fb.group({
                  key: item.key,
                  value: item.value,
                  secret: item.secret
                }));
              }
     
            });
            this.multis = this.blockForm.get('multis') as FormArray;
            data.multis.forEach(item=>{
              this.multis.push(this.fb.group({
                key: item.key,
                value: item.value
              }));
            });
            this.booleans = this.blockForm.get('booleans') as FormArray;
            data.booleans.forEach(item=>{
              this.booleans.push(this.fb.group({
                key: item.key,
                value: item.value
              }));
            });
    
    
          });
        }
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
  this.apiService.getSettings().subscribe(data=>{
      this.settingsLangs = data[0]["langs"]
      data[0]["langs"].forEach(element => {
        this.Language.push({"name":element["lang"]})
      });
    });
    
  }



  mainForm() {
    this.blockForm = this.fb.group({
      name: ['', [Validators.required]],
      //email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      parameters: this.fb.array([

      ]),
      shared: this.fb.array([
      ]),
      dynamic: this.fb.array([
      ]),
      booleans: this.fb.array([
      ]),
      multis: this.fb.array([
      ]),
      script: ['Copy Your Code Here', [Validators.required]],
      github: [false, [Validators.required]],
      github_path: [''],
      prescript: ['false',this.prescript_enabled],
      desc: [''],
      image: [''],
      lang: ['', [Validators.required]]
    })
  }


  get myForm(){
    return this.blockForm.controls;
  }

  connectGit(git){
    this.blockForm.get('github_path').setValue(git.path)
    this.blockForm.get('script').setValue(atob(git.content))
    this.blockForm.get('github').setValue(true)
    document.querySelectorAll('.bg-primary').forEach(item=>item.classList.remove('bg-primary'))
    document.getElementById(git.path).classList.add('bg-primary')
    this.editorOptions = { ...this.editorOptions, language: this.settingsLangs.filter(lang=>lang.type==git.prefix)[0].syntax }; 
    // this.ngxOptions= {
    //   lineNumbers: true,
    //   theme: 'material',
    //   readOnly: true
    // }
  }

  disconnectGit(){
    this.blockForm.get('github_path').setValue('')
    this.blockForm.get('script').setValue('')
    this.blockForm.get('github').setValue(false)
    document.querySelectorAll('.bg-primary').forEach(item=>item.classList.remove('bg-primary'))
    // this.ngxOptions= {
    //   lineNumbers: true,
    //   theme: 'material',
    //   readOnly: false
    // }
  }

  createItem(): FormGroup {
    return this.fb.group({
      key: '',
      value: '',
      secret: false,
    });
  }
  createBooleanItem(): FormGroup {
    return this.fb.group({
      key: '',
      value: false
    });
  }
  createMultiItem(): FormGroup {
    return this.fb.group({
      key: '',
      value: ''
    });
  }
  addItem(): void {
    this.parameters = this.blockForm.get('parameters') as FormArray;
    this.parameters.push(this.createItem());
  }
  addBooleanItem(): void {
    this.booleans = this.blockForm.get('booleans') as FormArray;
    this.booleans.push(this.createBooleanItem());
  }
  addMultiItem(): void {
    this.multis = this.blockForm.get('multis') as FormArray;
    this.multis.push(this.createMultiItem());
  }
  addItemShared(): void {
    this.shared = this.blockForm.get('shared') as FormArray;
    this.shared.push(this.createItem());
  }
  removeItem(index): void {
    this.parameters.removeAt(index)
    
  }
  removeItemBoolean(index): void {
    this.booleans.removeAt(index)
    
  }
  removeItemShared(index): void {
    this.shared.removeAt(index)
    
  }
  removeItemDynamic(index): void {
    this.dynamic.removeAt(index)
    
  }
  removeItemMulti(index): void {
    this.multis.removeAt(index)
    
  }

  onSubmit() {
    this.submitted = true;
    if (!this.blockForm.valid) {
      this._snackBar.open('Block Form Invalid', 'Close', {
        duration: 3000
      });
    } else {

      if (this.id == "")
      {
        this.apiService.createBlock(this.blockForm.value).subscribe(
          (res) => {
            console.log(this.blockForm.value)
            console.log('Block successfully created!')
            this.ngZone.run(() => this.router.navigateByUrl('/block/list'))
          }, (error) => {
            console.log(error)
            if (error.includes("Error Code: 400")){
              this._snackBar.open('Duplicate Names Not Allowed', 'Close', {
                duration: 3000
              });
            }
          });
      }
      else
      {
        this.apiService.updateBlock(this.id,this.blockForm.value).subscribe(
          (res) => {
            console.log(res)
            this.ngZone.run(() => this.router.navigateByUrl('/block/list'))
          }, (error) => {
            console.log(error)
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

