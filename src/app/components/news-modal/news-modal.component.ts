import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { SongsService } from '../../services/songs.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-news-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news-modal.component.html',
  styleUrl: './news-modal.component.scss'
})
export class NewsModalComponent implements OnInit {
  nuevosCambios: string[] = [];

  constructor(private songsService: SongsService) { }

  ngOnInit(): void {
    this.checkForChanges();
    this.getChanges();
  }

  checkForChanges(): void {
    const cambiosAceptados = localStorage.getItem('cambiosAceptados');
    if (!cambiosAceptados || cambiosAceptados !== 'true') {
      this.mostrarCambiosModal();
    }
  }

  mostrarCambiosModal(): void {
    const modalElement = document.getElementById('cambiosModal');
    if (modalElement) {
      const cambiosModal = new bootstrap.Modal(modalElement);
      cambiosModal.show();
    }
  }

  aceptarCambios(): void {
    localStorage.setItem('cambiosAceptados', 'true');
    const modalElement = document.getElementById('cambiosModal');
    if (modalElement) {
      const cambiosModal = bootstrap.Modal.getInstance(modalElement) as bootstrap.Modal;
      cambiosModal.hide();
    }
  }

  getChanges(): void {
    this.songsService.getChanges().subscribe((data: any) => {
      this.nuevosCambios = data?.changes;
    }, (error: any) => {
      console.error('Error al obtener los cambios', error);
    });
  }
}