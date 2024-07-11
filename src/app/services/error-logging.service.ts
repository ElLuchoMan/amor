import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorLoggingService {
  private errors: string[] = [];

  logError(error: string): void {
    const timestamp = new Date().toLocaleString();
    this.errors.push(`[${timestamp}] ${error}`);
  }

  getErrors(): string[] {
    return this.errors;
  }

  clearErrors(): void {
    this.errors = [];
  }
}
