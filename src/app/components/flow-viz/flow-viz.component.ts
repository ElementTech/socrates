import { Layout, Edge, Node } from '@swimlane/ngx-graph';
import { DagreNodesOnlyLayout } from './customDagreNodesOnly';
import { stepRound } from './customStepCurved';
import { CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit,NgZone, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
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
  onPlusClick(event){
    const id = "node"+(this.lastNum+1).toString()
    // const num = btoa(Math.random().toString()).substr(10, 3);
    const newLabel = (this.lastNum+1).toString()

    this.nodes.push({id:`${id}`,label:newLabel})

    this.nodes.push({id:`plus_${id}`,label:"+"})

    this.nodes = [...this.nodes];

    this.links.push({
      id:`${id}`,
      source: event.id.split("_").slice(1).join("_"),
      target: `${id}`,
      label: newLabel
    })

    this.links.push({
      id:`plus_${id}`,
      source: `${id}`,
      target: `plus_${id}`,
      label: '+'
    })

    console.log(`Pushing Node ${id} to be connected to ${event.id.split("_").slice(1).join("_")}. Giving it plus_${id}, it will be connected to ${id}`)

    this.links = [...this.links];
    this.lastNum++
    this.hidePlus()
    this.flowForm.get("nodes").setValue(this.nodes)
    this.flowForm.get("links").setValue(this.links)
    this.showPlus()
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
  }

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

    this.showPlus()
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
    console.log(this.id)
    if (this.id == ""){
      console.log("New Flow")
    }
    else
    {
      console.log("Populate Flow")
      this.apiService.getFlowviz(this.id).subscribe(data => {
        delete data.__v
        delete data._id
        console.log(data)
        this.nodes = data.nodes
        this.nodes = [...this.nodes]
        this.links = data.links
        this.links = [...this.links]
        this.flowForm.setValue(data)
        this.lastNum = parseInt(data.nodes.reduce((prev, current)=> ( (parseInt(prev.id)  > parseInt(current.id)) ? prev : current),0).label)
        this.hidePlus()
      });
    }
    
  }
  instanceList: any;
  ngAfterContentInit(){
    this.instances = this.apiService.getInstances().pipe(tap(data=>this.instanceList=data))
  }

  // generateWord() {
  //   return "bla";
  // }
  // ngAfterViewChecked() {
  //   this.cdRef.detectChanges();
  // }
  showPlusEnabled = true;
  hidePlus(){
    this.nodes = this.nodes.filter(item=>item.label != "+")
    this.links = this.links.filter(link=>!link.label.includes("+"))
    this.showPlusEnabled = true;
    // this.cdRef.detectChanges();
  }
  showPlus(){
    if (this.showPlusEnabled)
    {
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
      this.showPlusEnabled = false
    }
  }


  mainForm() {
    this.flowForm = this.fb.group({
      name: ['', [Validators.required]],
      nodes: [this.nodes, [Validators.required]],
      links: [this.links, [Validators.required]],
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
    this.hidePlus()
    this.flowForm.get('nodes').setValue(this.flowForm.get('nodes').value.filter(node=>node.label!="+"))
    this.flowForm.get('links').setValue(this.flowForm.get('links').value.filter(node=>node.label!="+"))
    if (!this.flowForm.valid) {
      
      return false;
    } else {
      if (this.id == "")
      {
        this.apiService.createFlowviz(this.flowForm.value).subscribe(
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
        this.apiService.updateFlowviz(this.id,this.flowForm.value).subscribe(
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