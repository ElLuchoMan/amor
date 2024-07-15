import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { SongsService } from '../../services/songs.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-news-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news-modal.component.html',
  styleUrls: ['./news-modal.component.scss']
})
export class NewsModalComponent implements OnInit {
  nuevosCambios: string[] = [];
  appVersion: string = environment.appVersion;

  constructor(private songsService: SongsService) { }

  ngOnInit(): void {
    this.checkForChanges();
    this.getChanges();
  }

  checkForChanges(): void {
    const cambiosInfo = localStorage.getItem('cambiosInfo');
    const cambiosInfoParsed = cambiosInfo ? JSON.parse(cambiosInfo) : null;
    
    if (!cambiosInfoParsed || !this.isSameVersion(cambiosInfoParsed.appVersion) || !cambiosInfoParsed.viewed) {
      this.mostrarCambiosModal();
    }
  }

  isSameVersion(storedVersion: string): boolean {
    if (!storedVersion) {
      return false;
    }
    const [currentMajor, currentMinor, currentPatch] = this.appVersion.split('.').map(Number);
    const [storedMajor, storedMinor, storedPatch] = storedVersion.split('.').map(Number);

    return currentMajor === storedMajor && currentMinor === storedMinor && currentPatch === storedPatch;
  }

  mostrarCambiosModal(): void {
    const modalElement = document.getElementById('cambiosModal');
    if (modalElement) {
      const cambiosModal = new bootstrap.Modal(modalElement);
      cambiosModal.show();
    }
  }

  aceptarCambios(): void {
    const cambiosInfo = {
      appVersion: this.appVersion,
      viewed: true
    };
    localStorage.setItem('cambiosInfo', JSON.stringify(cambiosInfo));
    const modalElement = document.getElementById('cambiosModal');
    if (modalElement) {
      const cambiosModal = bootstrap.Modal.getInstance(modalElement) as bootstrap.Modal;
      cambiosModal.hide();
    }
  }

  getChanges(): void {
    this.songsService.getChanges().subscribe((data: any) => {
      console.log('Data:', data);
      this.nuevosCambios = data.map((item: any) => item.change);
    }, (error: any) => {
      console.error('Error al obtener los cambios', error);
    });
  }
}
