import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { MessageService } from 'primeng/api';
import * as CodeMirror from 'codemirror';
import 'codemirror/addon/display/autorefresh';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { interval, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-dynamic',
  templateUrl: './dynamic.component.html',
  styleUrls: ['./dynamic.component.scss'],
  providers: [MessageService]
})
export class DynamicParametersComponent {
  Language:any = [];

  warning = [
      {severity:'warn', summary:'Warning', detail:'Dynamic Parameters should be fast and under a few seconds if possible. It is best to use a Docker image already containing the necessary packages rather than installing them every time.'},
  ];

  info = [
    {severity:'info', summary:'Info', detail:'Your script should print an array of dynamic options using the following format:'},
    {severity:'custom', summary:'Print', detail:'::set-output result=[a,b,c]', icon: 'pi-code'},
  ];

  ngxOptions= {
    lineNumbers: true,
    lineWrapping: true,
    theme: 'material',
    autoRefresh:true
  }
  parameters: any;

  constructor(private apiService: ApiService,public fb: FormBuilder,private messageService: MessageService) { }
  dynamicParameterForm: FormGroup;
  activeIndex: number = 0;

  ngOnInit(){
    this.apiService.getDynamicParameters().subscribe(data => {this.parameters = data});
    this.apiService.getSettings().subscribe(data=>{

      data[0]["langs"].forEach(element => {
        this.Language.push(element["lang"])
      });
    });
    
    this.dynamicParameterForm = this.fb.group({
      name: ['', [Validators.required]],
      script: ['echo "::set-output result=[a,b,c]"', [Validators.required]],
      lang: ['', [Validators.required]],
      output: ['']
    })
  
  }

  @ViewChild('codeMirror') private codeEditorCmp: CodemirrorComponent;
  chosenEditID = ""
  editThis(parameter)
  {
    this.chosenEditID = parameter._id
    delete parameter._id
    delete parameter.__v
    delete parameter.createdAt
    delete parameter.updatedAt
    this.dynamicParameterForm.setValue(parameter)
    // @ts-ignore
    
  }
  ngAfterViewChecked(){
    if (this.codeEditorCmp.codeMirror != undefined)
    {
      this.codeEditorCmp.codeMirror.refresh()
    }
  }

  onSubmit() {
    if (this.dynamicParameterForm.valid)
    {
      if (this.parameters.filter(param=>param.name==this.dynamicParameterForm.value.name).length == [0])
      {
        this.apiService.createDynamicParameter(Object.assign(this.dynamicParameterForm.value,{"output":""})).subscribe(
          data=>{
            this.apiService.getDynamicParameters().subscribe(data => {this.parameters = data});
            this.messageService.add({severity:'success', summary: 'Success', detail:'Parameter is Created'});
          },
          error=>{
            console.log(error)
            this.messageService.add({severity:'error', summary: 'Error', detail:'Parameter Could not be Created'});
          }
        );
      }
      else
      {
        this.apiService.updateDynamicParameter(this.chosenEditID,this.dynamicParameterForm.value).subscribe(
          data=>{
            this.apiService.getDynamicParameters().subscribe(data => {this.parameters = data});
            this.messageService.add({severity:'success', summary: 'Success', detail:'Parameter is Updated'});
          },
          error=>{
            console.log(error)
            this.messageService.add({severity:'error', summary: 'Error', detail:'Parameter Could not be Updated'});
          }
        );
      }
    }
    else
    {
      this.messageService.add({severity:'error', summary: 'Error', detail:'Parameter Form Invalid'});
    }


  }
  chosenRunParameter: any = {};
  chosenRunOutput: any = {};
  onRowRun(parameter) {
    this.chosenRunParameter = parameter
  }
  runtime: any = "";
  runParameter()
  {

    this.apiService.runDynamicParameter({"id":this.chosenRunParameter._id,"script":this.chosenRunParameter.script,"lang":this.chosenRunParameter.lang}).subscribe(data=>{
      this.runtime = ""
      console.log(data)
      document.getElementById('play-btn').classList.add("play-btn-animate");
      this.updateConsole(data)
    })
  }
  subscription: any;
  updateConsole(run_id)
  {
    
    this.subscription = interval(1000)
    .pipe(
        switchMap(() => this.apiService.getDockerInstance(run_id)),
        map(response => {
          if (Object.keys(response ? response : []).length == 0)
          {
            return true;
          }
          else
          {
            let runtime = []
            for (var key in response.runtime) {
              if (response.runtime.hasOwnProperty(key)) {
                runtime.push(key[0].toUpperCase()+":"+response.runtime[key])
              }
            }
            this.runtime = runtime
            this.chosenRunOutput.console=response.console.join("\r\n")
            this.chosenRunOutput.output = response.output[0] ? response.output[0].value.replaceAll('[','').replaceAll(']','').replace(/['"]+/g, '').split(',') : []

            // this.scrollLogToBottom()
            if(response.done == false) 
            {
              return response.data;
            }
            else 
            { 
              this.apiService.updateDynamicParameter(this.chosenRunParameter._id,{"output":response.output[0] ? response.output[0].value.replaceAll('[','').replaceAll(']','').replace(/['"]+/g, '').split(',') : []}).subscribe(data=>{
                this.apiService.getDynamicParameters().subscribe(data=>{
                  this.parameters = data
                })
              })
              return false; //or some error message or data.
            }
          }
        })
    )
    .subscribe(response => {
       if (response == false)
       {
        document.getElementById('play-btn').classList.remove("play-btn-animate");
         this.subscription.unsubscribe();
       }
    });
  }// Good
   
  onRowEditRemove(id) {
    if(window.confirm('Are you sure?')) 
    {
      this.apiService.deleteDynamicParameter(id).subscribe(data=>{
        this.apiService.getDynamicParameters().subscribe(data => {this.parameters = data});
        this.messageService.add({severity:'success', summary: 'Success', detail:'Parameter is Deleted'});
      },
      error=>{
        this.messageService.add({severity:'error', summary: 'Error', detail:'Parameter Could not be Deleted'});
      });
    }
  }

}
