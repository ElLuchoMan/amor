import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SongsService } from '../../services/songs.service';
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
  ];
  constructor(private songService: SongsService) { }

  user_id = '';

  ngOnInit(): void {
    this.user_id = this.songService.getUUID();
  }

  copyTokenToClipboard() {
    if (this.user_id) {
      navigator.clipboard.writeText(this.user_id).then(() => {
        console.log('Uuid copied to clipboard!');
      }).catch(err => {
        console.error('Could not copy uuid: ', err);
      });
    }
  }
}
