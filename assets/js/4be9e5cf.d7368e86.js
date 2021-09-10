"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[544],{4093:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return s},contentTitle:function(){return d},metadata:function(){return l},toc:function(){return c},default:function(){return u}});var o=t(7462),i=t(3366),a=(t(7294),t(3905)),r=["components"],s={sidebar_position:1},d="Helpers",l={unversionedId:"additional-functionality/utils",id:"additional-functionality/utils",isDocsHomePage:!1,title:"Helpers",description:"ngx-reactive-loading comes with built-in functions that can help you to handle the loading states of your application.",source:"@site/docs/additional-functionality/utils.md",sourceDirName:"additional-functionality",slug:"/additional-functionality/utils",permalink:"/ngx-reactive-loading/docs/additional-functionality/utils",editUrl:"https://github.com/riccardoperra/ngx-reactive-loading/edit/main/docs/docs/docs/additional-functionality/utils.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"HTTP Interceptors",permalink:"/ngx-reactive-loading/docs/loading-registry/http-interceptor"},next:{title:"someLoading()",permalink:"/ngx-reactive-loading/docs/operators/some-loading"}},c=[{value:"Operators",id:"operators",children:[{value:"<code>withLoading()</code>",id:"withloading",children:[]}]},{value:"Observable creation functions",id:"observable-creation-functions",children:[{value:"<code>someLoading()</code>",id:"someloading",children:[]},{value:"<code>untilLoading()</code>",id:"untilloading",children:[]}]}],p={toc:c};function u(e){var n=e.components,t=(0,i.Z)(e,r);return(0,a.kt)("wrapper",(0,o.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"helpers"},"Helpers"),(0,a.kt)("p",null,"ngx-reactive-loading comes with built-in functions that can help you to handle the loading states of your application.\nThese functions are standalone, and they do not force you to use all the features of this library."),(0,a.kt)("h2",{id:"operators"},"Operators"),(0,a.kt)("h3",{id:"withloading"},(0,a.kt)("inlineCode",{parentName:"h3"},"withLoading()")),(0,a.kt)("p",null,"Like ",(0,a.kt)("inlineCode",{parentName:"p"},"tap")," operator, perform a side effect for every emission on the source Observable,\nupdating the given subject when the source is subscribed and when terminates on complete."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { withLoading } from 'ngx-reactive-loading';\nimport { of, Subject } from 'rxjs';\nimport { delay, switchMap } from 'rxjs/operators';\n\nconst isLoading$ = new Subject<boolean>();\nconst refresh$ = new Subject<void>();\n\nconst source$ = of(null).pipe(delay(1000));\n\nconst subscription = refresh$\n  .pipe(switchMap(() => source$.pipe(withLoading(isLoading$))))\n  .subscribe();\n\n// Result\nisLoading$.subscribe((result: boolean) => {\n  // 1st emission (Output after refresh$ trigger): true\n  // 2nd emission (completed): false\n});\n\nrefresh$.next();\n")),(0,a.kt)("h2",{id:"observable-creation-functions"},"Observable creation functions"),(0,a.kt)("h3",{id:"someloading"},(0,a.kt)("inlineCode",{parentName:"h3"},"someLoading()")),(0,a.kt)("p",null,"Listen to the state changes of the given properties and return true if it finds a state which is currently loading"),(0,a.kt)("h4",{id:"listen-to-loading-store-or-properties-changes"},"Listen to loading store or properties changes"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { createLoadingStore, someLoading } from 'ngx-reactive-loading';\n\n// Creates the loading store\nconst loadingStore = createLoadingStore(['add', 'remove', 'clear']);\n\n// Observes loading store state\nconst isSomeLoading$ = someLoading([loadingStore]);\n\n// Observe loading properties state\nconst isAddingOrClearing$ = someLoading([loadingStore.add, loadingStore.clear]);\n")),(0,a.kt)("h4",{id:"listen-to-observable-changes"},"Listen to observable changes"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { createLoadingStore, someLoading } from 'ngx-reactive-loading';\nimport { Subject } from 'rxjs';\n\n// Creates the loading subjects\nconst loadingAdd$ = new Subject<boolean>();\nconst loading$ = new Subject<boolean>();\n\n// Observes the observables states\nconst isLoading = someLoading([loadingAdd$, loading$]);\n")),(0,a.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,a.kt)("div",{parentName:"div",className:"admonition-heading"},(0,a.kt)("h5",{parentName:"div"},(0,a.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,a.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,a.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"someLoading signature overloading")),(0,a.kt)("div",{parentName:"div",className:"admonition-content"},(0,a.kt)("p",{parentName:"div"},"You can pass both properties and loading store states as ",(0,a.kt)("inlineCode",{parentName:"p"},"someLoading")," parameters!"))),(0,a.kt)("h3",{id:"untilloading"},(0,a.kt)("inlineCode",{parentName:"h3"},"untilLoading()")),(0,a.kt)("p",null,"Listen to all triggers, then wait for result and end loading upon emit."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { untilLoading } from 'ngx-reactive-loading';\nimport { BehaviorSubject, switchMap, catchError, of, share } from 'rxjs';\n\nconst reload$ = new BehaviorSubject<null>(null);\n\nconst items$ = this.reload$.pipe(\n  switchMap(() =>\n    this.service.getList().pipe(\n      catchError(() => of(null)),\n      share()\n    )\n  )\n);\n\nconst isLoading$ = untilLoading([reload$], [items$]);\n")))}u.isMDXComponent=!0}}]);