import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LettersService } from '../../services/letters.service';

@Component({
  selector: 'app-letters-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './letters-page.component.html',
  styleUrls: ['./letters-page.component.scss']
})
export class LettersPageComponent implements OnInit {
  letters: { date: string, image: string, text: string }[] = [];

  constructor(private router: Router, private lettersService: LettersService) { }

  ngOnInit(): void {
    this.loadLetters();
  }

  loadLetters(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.lettersService.getLetters().subscribe(data => {
      this.letters = data
        .filter(letter => this.transformDate(letter.date).getTime() <= today.getTime())
        .sort((a, b) => this.transformDate(b.date).getTime() - this.transformDate(a.date).getTime());
    }, error => {
      console.error('Error fetching letters:', error);
    });
  }

  transformDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  viewLetter(letter: any): void {
    this.router.navigate(['/letter', letter.date]);
  }

  goToPage(pageName: string) {
    this.router.navigate([`${pageName}`]);
  }
}
