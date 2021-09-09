"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[520],{8215:function(e,t,n){var a=n(7294);t.Z=function(e){var t=e.children,n=e.hidden,r=e.className;return a.createElement("div",{role:"tabpanel",hidden:n,className:r},t)}},5064:function(e,t,n){n.d(t,{Z:function(){return c}});var a=n(7294),r=n(9443);var i=function(){var e=(0,a.useContext)(r.Z);if(null==e)throw new Error('"useUserPreferencesContext" is used outside of "Layout" component.');return e},o=n(6010),l="tabItem_1uMI",d="tabItemActive_2DSg";var c=function(e){var t,n=e.lazy,r=e.block,c=e.defaultValue,s=e.values,u=e.groupId,p=e.className,m=a.Children.toArray(e.children),g=null!=s?s:m.map((function(e){return{value:e.props.value,label:e.props.label}})),v=null!=c?c:null==(t=m.find((function(e){return e.props.default})))?void 0:t.props.value,h=i(),k=h.tabGroupChoices,f=h.setTabGroupChoices,b=(0,a.useState)(v),N=b[0],y=b[1],x=[];if(null!=u){var w=k[u];null!=w&&w!==N&&g.some((function(e){return e.value===w}))&&y(w)}var T=function(e){var t=e.currentTarget,n=x.indexOf(t),a=g[n].value;y(a),null!=u&&(f(u,a),setTimeout((function(){var e,n,a,r,i,o,l,c;(e=t.getBoundingClientRect(),n=e.top,a=e.left,r=e.bottom,i=e.right,o=window,l=o.innerHeight,c=o.innerWidth,n>=0&&i<=c&&r<=l&&a>=0)||(t.scrollIntoView({block:"center",behavior:"smooth"}),t.classList.add(d),setTimeout((function(){return t.classList.remove(d)}),2e3))}),150))},C=function(e){var t,n=null;switch(e.key){case"ArrowRight":var a=x.indexOf(e.target)+1;n=x[a]||x[0];break;case"ArrowLeft":var r=x.indexOf(e.target)-1;n=x[r]||x[x.length-1]}null==(t=n)||t.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":r},p)},g.map((function(e){var t=e.value,n=e.label;return a.createElement("li",{role:"tab",tabIndex:N===t?0:-1,"aria-selected":N===t,className:(0,o.Z)("tabs__item",l,{"tabs__item--active":N===t}),key:t,ref:function(e){return x.push(e)},onKeyDown:C,onFocus:T,onClick:T},null!=n?n:t)}))),n?(0,a.cloneElement)(m.filter((function(e){return e.props.value===N}))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},m.map((function(e,t){return(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==N})}))))}},7:function(e,t,n){n.r(t),n.d(t,{contentTitle:function(){return u},default:function(){return v},frontMatter:function(){return s},metadata:function(){return p},toc:function(){return m}});var a=n(7462),r=n(3366),i=(n(7294),n(3905)),o=n(5064),l=n(8215),d=n(6213),c=["components"],s={sidebar_position:3,title:"Loading directive"},u=void 0,p={unversionedId:"loading-store/loading-directive",id:"loading-store/loading-directive",isDocsHomePage:!1,title:"Loading directive",description:"Loading directive provide a simple approach to switch templates when the loading state change. To work correctly the",source:"@site/docs/loading-store/loading-directive.mdx",sourceDirName:"loading-store",slug:"/loading-store/loading-directive",permalink:"/ngx-reactive-loading/docs/loading-store/loading-directive",editUrl:"https://github.com/riccardoperra/ngx-reactive-loading/edit/main/docs/docs/docs/loading-store/loading-directive.mdx",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3,title:"Loading directive"},sidebar:"tutorialSidebar",previous:{title:"Loading service",permalink:"/ngx-reactive-loading/docs/loading-store/loading-service"},next:{title:"Custom tokens",permalink:"/ngx-reactive-loading/docs/loading-store/tokens"}},m=[{value:"API",id:"api",children:[{value:"Inputs",id:"inputs",children:[]}]},{value:"Example",id:"example",children:[]}],g={toc:m};function v(e){var t=e.components,n=(0,r.Z)(e,c);return(0,i.kt)("wrapper",(0,a.Z)({},g,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"loading-directive"},"Loading directive"),(0,i.kt)("p",null,"Loading directive provide a simple approach to switch templates when the loading state change. To work correctly the\nloading service must be provided by a component or module."),(0,i.kt)("h2",{id:"api"},"API"),(0,i.kt)("h3",{id:"inputs"},"Inputs"),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:null},"Input"),(0,i.kt)("th",{parentName:"tr",align:null},"Type"),(0,i.kt)("th",{parentName:"tr",align:null},"Default"),(0,i.kt)("th",{parentName:"tr",align:null},"Required"),(0,i.kt)("th",{parentName:"tr",align:null},"Description"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"[ngxLoading]"),(0,i.kt)("td",{parentName:"tr",align:null},"PropertyKey ","|"," PropertyKey[]"),(0,i.kt)("td",{parentName:"tr",align:null},"[]"),(0,i.kt)("td",{parentName:"tr",align:null},"false"),(0,i.kt)("td",{parentName:"tr",align:null},"Set the loading state properties that will be observed")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"[ngxLoadingElse]"),(0,i.kt)("td",{parentName:"tr",align:null},"TemplateRef ","|"," null"),(0,i.kt)("td",{parentName:"tr",align:null},"false"),(0,i.kt)("td",{parentName:"tr",align:null},"false"),(0,i.kt)("td",{parentName:"tr",align:null},"Render the custom loading template when ",(0,i.kt)("inlineCode",{parentName:"td"},"loading")," is true")))),(0,i.kt)("h2",{id:"example"},"Example"),(0,i.kt)(o.Z,{mdxType:"Tabs"},(0,i.kt)(l.Z,{value:"app.component.ts",label:"src/app/app.component.ts",default:!0,mdxType:"TabItem"},(0,i.kt)(d.Z,{className:"language-ts",mdxType:"CodeBlock"},"import { ChangeDetectionStrategy, Component } from '@angular/core';\nimport { LoadingService } from 'ngx-reactive-loading';\n\n@Component({\n  selector: 'app-root',\n  templateUrl: `./app.component.html`,\n  changeDetection: ChangeDetectionStrategy.OnPush,\n  providers: [LoadingService.componentProvider(['add'])],\n})\nclass AppComponent {\n  constructor(private readonly loadingService: LoadingService) {}\n}\n".trim())),(0,i.kt)(l.Z,{value:"app.component.html",label:"src/app/app.component.html",default:!0,mdxType:"TabItem"},(0,i.kt)(d.Z,{className:"language-html",mdxType:"CodeBlock"},"<button *ngxLoading=\"'add'; else loadingTpl\">Add</button>\n<ng-template #loadingTpl> Loading... </ng-template>\n".trim()))))}v.isMDXComponent=!0}}]);