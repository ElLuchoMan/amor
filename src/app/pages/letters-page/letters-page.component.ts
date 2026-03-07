import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  constructor(
    private router: Router, 
    private lettersService: LettersService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadLetters();
  }

  loadLetters(): void {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    this.lettersService.getLetters().subscribe(data => {
      console.log('Respuesta cruda de get-letters:', data);
      
      this.letters = data
        .filter(letter => {
          if (!letter || !letter.date) return false;
          const letterDate = this.transformDate(letter.date);
          return letterDate.getTime() <= today.getTime();
        })
        .sort((a, b) => this.transformDate(b.date).getTime() - this.transformDate(a.date).getTime());
        
      console.log('Cartas filtradas (`this.letters`):', this.letters);
      // Forzar renderizado por si Zone.js se quedó huérfano
      this.cdr.detectChanges();
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
