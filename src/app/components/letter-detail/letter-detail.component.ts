import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SongsService } from '../../services/songs.service';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { LettersService } from '../../services/letters.service';

@Component({
  selector: 'app-letter-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './letter-detail.component.html',
  styleUrls: ['./letter-detail.component.scss']
})
export class LetterDetailComponent implements OnInit {
  letter: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lettersService: LettersService,
  ) { }

  ngOnInit(): void {
    const date = this.route.snapshot.paramMap.get('date');
    this.lettersService.getLetters().subscribe(letters => {
      this.letter = letters.find(l => l.date === date);
    });
  }

  goBack(): void {
    this.router.navigate(['/letters']);
  }
}
