"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[18],{6946:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return s},contentTitle:function(){return c},metadata:function(){return d},toc:function(){return p},default:function(){return u}});var o=t(7462),i=t(3366),r=(t(7294),t(3905)),a=["components"],s={sidebar_position:2},c="withLoading()",d={unversionedId:"operators/with-loading",id:"operators/with-loading",isDocsHomePage:!1,title:"withLoading()",description:"Like tap operator, perform a side effect for every emission on the source Observable,",source:"@site/docs/operators/with-loading.md",sourceDirName:"operators",slug:"/operators/with-loading",permalink:"/ngx-reactive-loading/docs/operators/with-loading",editUrl:"https://github.com/riccardoperra/ngx-reactive-loading/edit/main/docs/docs/docs/operators/with-loading.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"someLoading()",permalink:"/ngx-reactive-loading/docs/operators/some-loading"},next:{title:"untilLoading()",permalink:"/ngx-reactive-loading/docs/operators/until-loading"}},p=[{value:"Example",id:"example",children:[]}],l={toc:p};function u(e){var n=e.components,t=(0,i.Z)(e,a);return(0,r.kt)("wrapper",(0,o.Z)({},l,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"withloading"},"withLoading()"),(0,r.kt)("p",null,"Like ",(0,r.kt)("inlineCode",{parentName:"p"},"tap")," operator, perform a side effect for every emission on the source Observable,\nupdating the given subject when the source is subscribed and when terminates on complete."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import {Subject, MonoTypeOperatorFunction} from 'rxjs';\n\nconst withLoading: <T>(\n    loadingSubject: Subject<boolean\n) => MonoTypeOperatorFunction<T>;\n")),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"loadingSubject")," - The subject that will be updated when the source subscribe and when terminates on complete.")),(0,r.kt)("h2",{id:"example"},"Example"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { withLoading } from 'ngx-reactive-loading';\nimport { of, Subject } from 'rxjs';\nimport { delay, switchMap } from 'rxjs/operators';\n\nconst isLoading$ = new Subject<boolean>();\nconst refresh$ = new Subject<void>();\n\nconst source$ = of(null).pipe(delay(1000));\n\nconst subscription = refresh$\n  .pipe(switchMap(() => source$.pipe(withLoading(isLoading$))))\n  .subscribe();\n\n// Result\nisLoading$.subscribe((result: boolean) => {\n  // 1st emission (Output after refresh$ trigger): true\n  // 2nd emission (completed): false\n});\n\nrefresh$.next();\n")))}u.isMDXComponent=!0}}]);