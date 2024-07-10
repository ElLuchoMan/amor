import { Component, inject, OnInit } from '@angular/core';
import { SongsService } from '../../services/songs.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})
export class SongsComponent implements OnInit {
  songs: any;
  isLoading = true;
  private songService = inject(SongsService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  ngOnInit(): void {
    this.getSongs();
  }

  getSongs() {
    this.songService.listSongs().subscribe((data: any) => {
      this.songs = data.songs[0].songs;
      this.isLoading = false;
    }, (error: any) => {
      console.error('Error fetching songs:', error);
      this.isLoading = false;
      this.toastr.error(`Error fetching songs: ${error} `, 'ERROR');
    });
  }

  goToPage(pageName: string) {
    this.router.navigate([`${pageName}`]);
  }
}
