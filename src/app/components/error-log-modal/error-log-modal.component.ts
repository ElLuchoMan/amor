import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorLoggingService } from '../../services/error-logging.service';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-error-log-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-log-modal.component.html',
  styleUrls: ['./error-log-modal.component.scss']
})
export class ErrorLogModalComponent implements OnInit {
  errorLogs: string[] = [];

  constructor(public activeModal: NgbActiveModal, private errorLoggingService: ErrorLoggingService) {}

  ngOnInit(): void {
    this.errorLogs = this.errorLoggingService.getErrors();
  }

  clearErrors(): void {
    this.errorLoggingService.clearErrors();
    this.errorLogs = [];
  }
}