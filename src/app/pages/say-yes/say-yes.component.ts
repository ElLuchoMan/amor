import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { Router } from '@angular/router';
import { SongsService } from '../../services/songs.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-say-yes',
  templateUrl: './say-yes.component.html',
  styleUrls: ['./say-yes.component.scss']
})
export class SayYesComponent implements OnInit, AfterViewInit {
  @ViewChild('exampleModal', { static: false }) exampleModalElement!: ElementRef;
  private modal: bootstrap.Modal | undefined;
  image = '';
  insta = '';
  youtube = '';

  constructor(private router: Router, private service: SongsService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getResources();
  }

  ngAfterViewInit(): void {
    this.initModal();
  }

  getResources(): void {
    this.service.listResources().subscribe({
      next: (data: any) => {
        this.image = this.service.getUrlByType(data, 'image');
        this.insta = this.service.getUrlByType(data, 'insta');
        this.youtube = this.service.getUrlByType(data, 'youtube');
      },
      error: (error: any) => {
        console.error('Error fetching image and insta:', error);
        this.toastr.error(`Error fetching image and insta: ${error} `, 'ERROR');
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
      this.toastr.error('Modal element not found', 'ERROR');
    }
  }

  openModal(): void {
    if (this.modal) {
      this.modal.show();
    } else {
      console.error('Modal is not initialized');
      this.toastr.error('Modal is not initialized', 'ERROR');
    }
  }

  salirDePagina(): void {
    window.location.href = this.youtube;
  }

  goToPage(pageName: string): void {
    this.router.navigate([pageName]);
  }
}
