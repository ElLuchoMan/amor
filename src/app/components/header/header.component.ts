import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorLoggingService } from '../../services/error-logging.service';
import { ResourcesService } from '../../services/resources.service';
import { UUIDService } from '../../services/uuid.service';
import { ErrorLogModalComponent } from '../error-log-modal/error-log-modal.component';

interface NavLink {
  label: string;
  path: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  navLinks: NavLink[] = [
    { label: 'Inicio', path: '/' },
    { label: 'Hello', path: '/hello' },
    { label: 'Canciones', path: '/songs' },
    { label: 'Pregunta', path: '/say-yes' },
    { label: 'No Estés Triste', path: '/no-estes-triste' },
    { label: 'Cartas', path: '/letters' },
    { label: 'Space Invaders', path: '/space-invaders' },
  ];
  logo = '';
  user_id = '';

  constructor(
    private resourcesService: ResourcesService,
    private uuidService: UUIDService,
    private modalService: NgbModal,
    private errorLoggingService: ErrorLoggingService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.user_id = this.uuidService.getUUID();
    this.getLogo();
  }

  getLogo(): void {
    this.resourcesService.listResources().subscribe({
      next: (data: any) => {
        setTimeout(() => {
          this.logo = this.resourcesService.getUrlByType(data, 'logo');
          this.cdr.detectChanges();
        });
      },
      error: (err: any) => {
        setTimeout(() => {
          this.openModal(`Error retrieving logo: ${this.errorLoggingService.logError(err)}`);
          this.cdr.detectChanges();
        });
      }
    });
  }

  openModal(errorMessage: string): void {
    this.errorLoggingService.logError(errorMessage);
    const modalRef = this.modalService.open(ErrorLogModalComponent);
    modalRef.componentInstance.errors = this.errorLoggingService.getErrors();
  }
}
