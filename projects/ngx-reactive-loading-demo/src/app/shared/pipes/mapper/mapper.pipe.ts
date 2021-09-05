import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';

type FunctionTypeParams<T extends (p: any, ...args: any[]) => any> = T extends (
  p: infer Params,
  ...args: any[]
) => any
  ? Params
  : never;

type FunctionTypeArgs<T extends (p: any, ...args: any[]) => any> = T extends (
  p: any,
  ...args: infer Arguments
) => any
  ? Arguments
  : never;

type FunctionTypeReturn<T extends (p: any, ...args: any[]) => any> = T extends (
  p: any,
  ...args: any[]
) => infer Return
  ? Return
  : never;

@Pipe({
  name: 'mapper',
})
export class MapperPipe implements PipeTransform {
  transform<P, Args extends any[], R>(
    value: P,
    fn: (arg: P, ...args: Args) => R,
    ...args: Args
  ): R;
  transform<
    OriginFunctionType extends (p: any, ...args: any[]) => any,
    P extends FunctionTypeParams<OriginFunctionType>,
    T extends FunctionTypeReturn<OriginFunctionType>,
    Args extends FunctionTypeArgs<OriginFunctionType>
  >(value: P, fn: OriginFunctionType, ...args: Args): T {
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
