import { Component, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { GetDataService } from './get-data.service';
import { Observable, throwError } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [GetDataService]
})
export class AppComponent {
  @ViewChild("myDiv") divView: ElementRef;
  countOpenBracket = 0;
  title = 'jsontree';
  tree = '';  
  countObjectType = 0;
  jsonValid: boolean;
  jsonText: string;
  url: string;

  constructor(private elementRef: ElementRef, private getJson: GetDataService){}

  ngOnInit() {
  }

  submitJson(url){
    this.getJson.getJson(url).subscribe((data) => {
      this.resetTree();
      this.handlerJson(data);
      this.divView.nativeElement.innerHTML = this.tree;
      for(let i = 1; i <= this.countObjectType; i++){
        if(this.elementRef.nativeElement.querySelector('#btnCol' + i)){
          this.elementRef.nativeElement.querySelector('#btnCol' + i).addEventListener('click', this.collapse.bind(this));
        }
        if(this.elementRef.nativeElement.querySelector('#btnExp' + i)){
          this.elementRef.nativeElement.querySelector('#btnExp' + i).addEventListener('click', this.expande.bind(this));
        }
      }
    });
  }

  handlerJson(json){
    try{
     this.buildTree(json); 
      while(this.countOpenBracket > 0){
        this.tree = this.tree + '}';
        this.tree = this.tree + '</div>';
        this.countOpenBracket--;
      }
    } catch (e){
      this.jsonValid = false;
    }
  }

  buildTree(obj1){
    for (const property in obj1) {
      if(typeof obj1[property] == 'object'){
        this.countObjectType++;
        if( Array.isArray(obj1[property])){
          this.tree = this.tree + '<div id="objExp' + this.countObjectType + '" " style="display: none;color: #1e4c8f;padding-left: 5%">' + '"' + property + '"' + ':' + ' ' +
          '<button id="btnExp' + this.countObjectType + '" type="button" (click)="expande(event)" style="line-height: 0.5;color: #1e4c8f;background-color: #FFFFFF;border-color: #1e4c8f;border-radius: 2px;border-style: solid;border-width: .1em;cursor: pointer;padding: 1px;">+</button>' + ' ' +
          '[ ... ]' + '</div>' +

          '<div id="objColl' + this.countObjectType + '" " style="display:block;color: #1e4c8f;padding-left: 5%">' + '"' + property + '"' + ':' + ' '
              + '<button id="btnCol' + this.countObjectType + '" type="button" (click)="collapse(event)" style="line-height: 0.5;color: #1e4c8f;background-color: #FFFFFF;border-color: #1e4c8f;border-radius: 2px;border-style: solid;border-width: .1em;cursor: pointer;padding: 1px 1px 2px 1px">-</button>' 
              + ' ' + '<span style="color: #dc9393;">[</span>';
          this.buildTree(obj1[property]);
          this.tree = this.tree + '<span style="color: #dc9393;">]</span>';
          this.tree = this.tree + '</div>';
        }else{
          this.tree = this.tree + '<div id="objExp' + this.countObjectType + '" " style="display: none;color: #1e4c8f;padding-left: 5%">' + '"' + property + '"' + ':' + ' ' +
          '<button id="btnExp' + this.countObjectType + '" type="button" (click)="expande(event)" style="line-height: 0.5;color: #1e4c8f;background-color: #FFFFFF;border-color: #1e4c8f;border-radius: 2px;border-style: solid;border-width: .1em;cursor: pointer;padding: 1px;">+</button>' + ' ' +
          '{ ... }' + '</div>' +

          '<div id="objColl' + this.countObjectType + '" " style="display:block;color: #1e4c8f;padding-left: 5%">' + '"' + property + '"' + ':' + ' '
              + '<button id="btnCol' + this.countObjectType + '" type="button" (click)="collapse(event)" style="line-height: 0.5;color: #1e4c8f;background-color: #FFFFFF;border-color: #1e4c8f;border-radius: 2px;border-style: solid;border-width: .1em;cursor: pointer;padding: 1px 1px 2px 1px">-</button>' 
              + ' ' + '<span>{</span>';

          this.countOpenBracket++;
          this.buildTree(obj1[property]);
          this.tree = this.tree + '}';
          this.tree = this.tree + '</div>';
        }
      }else{
        this.tree = this.tree + '<div style="padding-left: 5%">' + '"' + property + '"' + ':'  + ' '
                  + '<span style="color: #080;">' + '"' + obj1[property] + '"' + ',' + '</span>' + '</div>';
      }     
    }
    this.countOpenBracket--;
  }
 
  collapse(e){ 
    this.elementRef.nativeElement.querySelector('#objExp' + e.target.id.slice(6)).style.display = 'block';
    this.elementRef.nativeElement.querySelector('#objColl' + e.target.id.slice(6)).style.display = 'none';
  }

  expande(e){
    this.elementRef.nativeElement.querySelector('#objColl' + e.target.id.slice(6)).style.display = 'block';
    this.elementRef.nativeElement.querySelector('#objExp' + e.target.id.slice(6)).style.display = 'none';
  }

  resetTree(){
    this.tree = '';
    this.divView.nativeElement.innerHTML = this.tree;
    this.countObjectType = 0;
    this.countOpenBracket = 0;
  } 

}
