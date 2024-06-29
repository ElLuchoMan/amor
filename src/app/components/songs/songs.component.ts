import { Component, inject, OnInit } from '@angular/core';
import { SongsService } from '../../services/songs.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './songs.component.html',
  styleUrl: './songs.component.scss'
})
export class SongsComponent implements OnInit {
  songs: any;
  private songService = inject(SongsService);
  private router = inject(Router);

  ngOnInit(): void {
    this.getSongs();

  }

  getSongs() {
    this.songService.listSongs().subscribe((data: any) => {
      this.songs = data.songs;
    })
  }

  goToPage(pageName: string) {
    this.router.navigate([`${pageName}`]);
  }
}
