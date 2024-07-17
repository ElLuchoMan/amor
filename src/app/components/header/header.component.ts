import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SongsService } from '../../services/songs.service';
import { ErrorLoggingService } from '../../services/error-logging.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorLogModalComponent } from '../error-log-modal/error-log-modal.component';
import { ResourcesService } from '../../services/resources.service';
import { UUIDService } from '../../services/uuid.service';
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
export class HeaderComponent {
  navLinks: NavLink[] = [
    { label: 'Inicio', path: '/' },
    { label: 'Hello', path: '/hello' },
    { label: 'Canciones', path: '/songs' },
    { label: 'Pregunta', path: '/say-yes' },
    { label: 'No Estés Triste', path: '/no-estes-triste' },
    { label: 'Cartas', path: '/letters' }
  ];
  constructor(private songService: SongsService, private errorLoggingService: ErrorLoggingService,
    private resourcesService: ResourcesService, private uuidService: UUIDService, private modalService: NgbModal) { }
  logo = '';
  user_id = '';

  ngOnInit(): void {
    this.user_id = this.uuidService.getUUID();
    this.getLogo();
  }

  copyTokenToClipboard() {
    if (this.user_id) {
      navigator.clipboard.writeText(this.user_id).then(() => {
        console.log('Uuid copied to clipboard!');
      }).catch(err => {
        this.openModal(`Could not copy uuid: ${this.errorLoggingService.logError(err)}`);
      });
    }
  }
  getLogo() {
    this.resourcesService.listResources().subscribe({
      next: (data: any) => {
        this.logo = this.resourcesService.getUrlByType(data, 'logo');
      }
    });
  }
  openModal(errorMessage: string): void {
    this.errorLoggingService.logError(errorMessage);
    const modalRef = this.modalService.open(ErrorLogModalComponent);
    modalRef.componentInstance.errors = this.errorLoggingService.getErrors();
  }
}
