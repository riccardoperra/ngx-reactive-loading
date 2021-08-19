import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  log(title: string, content: unknown): void {
    console.group(title);
    console.log(content);
    console.groupEnd();
  }
}
