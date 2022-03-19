import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import 'codemirror/mode/python/python';

if (environment.production) {
  enableProdMode();
}

//@ts-ignore
Array.prototype.unique = function() {
  var a = this.concat();
  for(var i=0; i<a.length; ++i) {
      for(var j=i+1; j<a.length; ++j) {
          if(a[i]["key"] === a[j]["key"])
              a.splice(j--, 1);
      }
  }

  return a;
};

//@ts-ignore
Array.prototype.uniqueDynamic = function() {
  var a = this.concat();
  for(var i=0; i<a.length; ++i) {
      for(var j=i+1; j<a.length; ++j) {
          if(a[i]["name"] === a[j]["name"])
              a.splice(j--, 1);
      }
  }

  return a;
};

//@ts-ignore
Array.prototype.addNotFirst = function() {
  let seen = []
  var a = this.concat();
  for(var i=0; i<a.length; ++i) {
     if (!seen.includes(a[i]["key"]))
     {  
        seen.push(a[i]["key"])
        a[i].first = false
     }
     else
     {
        a[i].first = true
     }
  }

  return a;
};



platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
