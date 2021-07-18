### ngx-reactive-loading Example application
[Hosted Example](https://ngx-loading.vercel.app)

Example application using ngx-reactive-loading library, showcasing some pattern to use it.

This app is a simplified todo manager. The user can only add a new todo, remove it and get a new auto-generated list of todo.
It is separated into three pages to show different approaches to use this library.

Included
- [@angular/material](https://github.com/angular/components) - Angular material
- [@ngrx/component-store](https://ngrx.io/guide/component-store) - Component store (layout state)
- [@angular/router](https://angular.io/guide/router) - Angular router
- [@ngneat/hot-toast](https://github.com/ngneat/hot-toast) - Custom Toast (example 2 and 3) 

Examples
- [Example 1](src/app/pages/01-loading-store-example) - Using `createLoadingStore` helper.
- [Example 2](src/app/pages/02-loading-store-service-example) -  Using component based LoadingService
- [Example 3](src/app/pages/03-loading-store-ngrx-example) - Using module based LoadingService with [@ngrx/store](https://ngrx.io/guide/store) and [@ngrx/effects](https://ngrx.io/guide/effectrs)

### Quick start
```bash
git clone https://github.com/riccardoperra/ngx-reactive-loading.git

# go to repo directory
cd ngx-reactive-loading

# install dependencies
npm i

# start the server
npm run start:demo
``` 
