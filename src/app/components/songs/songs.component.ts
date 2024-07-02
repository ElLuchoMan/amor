import { Component, inject, OnInit } from '@angular/core';
import { SongsService } from '../../services/songs.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})
export class SongsComponent implements OnInit {
  songs: any;
  private songService = inject(SongsService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  ngOnInit(): void {
    this.getSongs();
  }

  getSongs(): void {
    this.songService.listSongs().subscribe({
      next: (data: any) => {
        this.songs = data.songs;
      },
      error: (error: any) => {
        console.error('Error fetching songs:', error);
        this.toastr.error(`Error fetching songs: ${error} `, 'ERROR');
      }
    });
  }

  goToPage(pageName: string): void {
    this.router.navigate([pageName]);
  }
}
