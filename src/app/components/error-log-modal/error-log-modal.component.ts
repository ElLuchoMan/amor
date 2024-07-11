import { Component, OnInit } from '@angular/core';
import { ErrorLoggingService } from '../../services/error-logging.service';

@Component({
  selector: 'app-error-log-modal',
  templateUrl: './error-log-modal.component.html',
  styleUrls: ['./error-log-modal.component.scss']
})
export class ErrorLogModalComponent implements OnInit {
  errors: string[] = [];

  constructor(private errorLoggingService: ErrorLoggingService) { }

  ngOnInit(): void {
    this.errors = this.errorLoggingService.getErrors();
  }

  clearErrors(): void {
    this.errorLoggingService.clearErrors();
    this.errors = [];
  }

  closeModal(): void {
    const modal = document.getElementById('errorLogModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
}
