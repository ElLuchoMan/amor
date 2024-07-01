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
  constructor(private router: Router) {}

  cards: Card[] = [
    {
      title: 'Hello Page',
      imageUrl: 'assets/hello.jpg',
      description: 'Go to the Hello Page',
      route: '/hello'
    },
    {
      title: 'Songs Page',
      imageUrl: 'assets/songs.jpg',
      description: 'Go to the Songs Page',
      route: '/songs'
    },
    {
      title: 'Say Yes Page',
      imageUrl: 'assets/say-yes.jpg',
      description: 'Go to the Say Yes Page',
      route: '/say-yes'
    },
    {
      title: 'No Estes Triste',
      imageUrl: 'assets/no-estes-triste.jpg',
      description: 'Go to the No Estes Triste Page',
      route: '/no-estes-triste'
    }
  ];

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
