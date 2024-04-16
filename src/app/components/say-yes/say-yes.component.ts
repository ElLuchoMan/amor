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
  @ViewChild('exampleModal', { static: false }) exampleModalElement: ElementRef | undefined;
  private modal: any;
  image = '';
  insta ='';

  constructor(private router: Router, private service: SongsService) {}

  ngOnInit() {
    this.getImage();
  }

  ngAfterViewInit() {
    this.initModal();
  }

  getImage() {
    this.service.listSongs().subscribe((data: any) => {
      this.image = data.image;
      this.insta = data.insta;
    });
  }

  initModal() {
    if (this.exampleModalElement?.nativeElement) {
      this.modal = new bootstrap.Modal(this.exampleModalElement.nativeElement, {
        keyboard: false
      });
    } else {
      console.error('Modal element not found');
    }
  }

  openModal() {
    if (this.modal) {
      this.modal.show();
    } else {
      console.error('Modal is not initialized');
    }
  }

  salirDePagina() {
    window.location.href = 'https://youtu.be/7oKZeo779Xg?si=f69rP2eFTD26J6Sl&t=101';
  }

  goToPage(pageName: string) {
    this.router.navigate([pageName]);
  }
}
