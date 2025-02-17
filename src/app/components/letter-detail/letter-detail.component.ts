import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LettersService } from '../../services/letters.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-letter-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './letter-detail.component.html',
  styleUrls: ['./letter-detail.component.scss']
})
export class LetterDetailComponent implements OnInit {
  letter: any;
  safeVideoUrl?: SafeResourceUrl; // URL segura del video

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lettersService: LettersService,
    private sanitizer: DomSanitizer // Agregar DomSanitizer
  ) {}

  ngOnInit(): void {
    const date = this.route.snapshot.paramMap.get('date');
    this.lettersService.getLetters().subscribe(letters => {
        this.letter = letters.find(l => l.date === date);
        
        if (this.letter?.video) {
            console.log("Video URL antes de sanitizar:", this.letter.video);
            this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.letter.video);
            console.log("URL Sanitizada:", this.safeVideoUrl);
        }
    });
}
getVideoIframe(): SafeHtml {
  if (this.letter?.video) {
      const embedCode = `<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="${this.letter?.video}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Aniversario"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>`;
      return this.sanitizer.bypassSecurityTrustHtml(embedCode);
  }
  return '';
}


  goBack(): void {
    this.router.navigate(['/letters']);
  }
}
