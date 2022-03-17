import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-dynamic',
  templateUrl: './dynamic.component.html',
  styleUrls: ['./dynamic.component.scss']
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
    theme: 'material',
  }

  constructor(private apiService: ApiService,public fb: FormBuilder) { }
  dynamicParameterForm: FormGroup;
  ngOnInit(){

    this.apiService.getSettings().subscribe(data=>{

      data[0]["langs"].forEach(element => {
        this.Language.push(element["lang"])
      });
    });
    
    this.dynamicParameterForm = this.fb.group({
      name: ['', [Validators.required]],
      script: ['echo "::set-output result=[a,b,c]"', [Validators.required]],
      lang: ['', [Validators.required]],
    })
  
  }
  onSubmit() {
    console.log(this.dynamicParameterForm.value);
  }
   

}
