import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SongsService } from '../../services/songs.service';

@Component({
  selector: 'app-letters-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './leters-page.component.html',
  styleUrls: ['./leters-page.component.scss']
})
export class LettersPageComponent implements OnInit {
  letters: { date: string, image: string, text: string }[] = [];

  constructor(private router: Router, private songsService: SongsService) { }

  ngOnInit(): void {
    this.loadLetters();
  }

  loadLetters(): void {
    this.songsService.getLetters().subscribe(data => {
      this.letters = data;
    }, error => {
      console.error('Error fetching letters:', error);
    });
  }

  viewLetter(letter: any): void {
    this.router.navigate(['/letter', letter.date]);
  }
  
  goToPage(pageName: string) {
    this.router.navigate([`${pageName}`]);
  }
}
