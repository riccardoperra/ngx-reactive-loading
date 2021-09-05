import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
@Pipe({
  name: 'mapper',
})
export class MapperPipe implements PipeTransform {
  transform<P, Args extends any[], R>(
    value: P,
    fn: (arg: P, ...args: Args) => R,
    ...args: Args
  ): R {
    return fn(value, ...args);
  }
}

@NgModule({
  imports: [CommonModule],
  exports: [MapperPipe],
  declarations: [MapperPipe],
  providers: [],
})
export class MapperPipeModule {}
