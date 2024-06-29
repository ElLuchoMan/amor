import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { Router } from '@angular/router';
import { SongsService } from '../../services/songs.service';

@Component({
  selector: 'app-say-yes',
  templateUrl: './say-yes.component.html',
  styleUrls: ['./say-yes.component.scss']
})
export class SayYesComponent implements OnInit, AfterViewInit {
  @ViewChild('exampleModal', { static: false }) exampleModalElement!: ElementRef | undefined;
  private modal: bootstrap.Modal | undefined;
  image = '';
  insta = '';

  constructor(private router: Router, private service: SongsService) { }

  ngOnInit(): void {
    this.getImage();
  }

  ngAfterViewInit(): void {
    this.initModal();
  }

  getImage(): void {
    this.service.listSongs().subscribe({
      next: (data: any) => {
        this.image = data.image || '';
        this.insta = data.insta || '';
      },
      error: (error: any) => {
        console.error('Error fetching image and insta:', error);
        // Puedes manejar el error aquí, por ejemplo mostrando un mensaje al usuario
      }
    });
  }

  initModal(): void {
    if (this.exampleModalElement) {
      this.modal = new bootstrap.Modal(this.exampleModalElement.nativeElement, {
        keyboard: false
      });
    } else {
      console.error('Modal element not found');
    }
  }

  openModal(): void {
    if (this.modal) {
      this.modal.show();
    } else {
      console.error('Modal is not initialized');
    }
  }

  salirDePagina(): void {
    window.location.href = 'https://youtu.be/7oKZeo779Xg?si=f69rP2eFTD26J6Sl&t=101';
  }

  goToPage(pageName: string): void {
    this.router.navigate([pageName]);
  }
}
