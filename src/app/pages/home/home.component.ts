import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Card {
  title: string;
  imageUrl: string;
  description: string;
  route: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private router: Router) { }
  user: string = 'ElLuchoMan';
  url: string = 'https://github.com/ElLuchoMan'
  cards: Card[] = [
    {
      title: 'Hola',
      imageUrl: 'assets/hello.jpg',
      description: '¿Te gustaría recordar cómo te pedí que fueras mi novia? ¡Revívelo aquí!',
      route: '/hello'
    },
    {
      title: 'Canciones',
      imageUrl: 'assets/songs.jpg',
      description: '¿Quisieras recordar cada una de las canciones que te dediqué? ¡Escúchalas aquí!',
      route: '/songs'
    },
    {
      title: 'Pregunta',
      imageUrl: 'assets/say-yes.jpg',
      description: 'Mira, aquí está la pregunta más importante de todas.',
      route: '/say-yes'
    },
    {
      title: 'No Estés Triste',
      imageUrl: 'assets/no-estes-triste.jpg',
      description: 'Esta es una función especial para ayudarte a distraerte un poco mientras pienso en cómo puedo ayudarte.',
      route: '/no-estes-triste'
    },
    {
      title: 'Cartas',
      imageUrl: 'assets/letters.jpg',
      description: '¿Y si mes a mes te escribo algo que te muestre cuánto te amo?',
      route: '/letters'
    }
  ];

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
