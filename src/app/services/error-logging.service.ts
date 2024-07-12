import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorLoggingService {
  private errors: string[] = [];

  logError(error: any): void {
    console.log(error);
    const timestamp = new Date().toLocaleString();
    const simplifiedError = this.simplifyError(error);
    this.errors.push(`[${timestamp}] ${simplifiedError}`);
  }

  getErrors(): string[] {
    return this.errors;
  }

  clearErrors(): void {
    this.errors = [];
  }

  public simplifyError(error: any): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'object' && error !== null) {
      const { message, name, status, statusText, url, error: innerError } = error;
      return JSON.stringify({
        message,
        name,
        status,
        statusText,
        url,
        error: innerError ? this.simplifyError(innerError) : undefined
      });
    }

    return 'An unknown error occurred';
  }
}
