import { Component, inject, OnInit } from '@angular/core';
import { SongsService } from '../../services/songs.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-hello',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.scss']
})
export class HelloComponent implements OnInit {
  text: string[] = [];
  private songService = inject(SongsService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  ngOnInit(): void {
    this.getText();
  }

  getText() {
    this.songService.listSongs().subscribe({
      next: (data: any) => {
        this.text = data.text[0].letter.split("\n\n");
        setTimeout(() => {
          this.toastr.success('Información cargada', '¡BIEN!');
        }, 5000);
      },
      error: (error: any) => {
        console.error('Error fetching letter:', error);
        this.toastr.error(`Error fetching letter: ${error}`, 'ERROR');
      }
    });
  }

  goToPage(pageName: string): void {
    this.router.navigate([`${pageName}`]);
  }
}