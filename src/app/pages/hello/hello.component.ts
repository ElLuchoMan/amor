import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { SongsService } from '../../services/songs.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoadingComponent } from '../../components/loading/loading.component';
import { TextService } from '../../services/text.service';

@Component({
  selector: 'app-hello',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.scss']
})
export class HelloComponent implements OnInit {
  text: string[][] = [];
  isLoading = true;
  private songService = inject(SongsService);
  private textService = inject(TextService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.getText();
  }

  getText() {
    this.textService.getText().subscribe((data: any) => {
      this.text = data[0].letter.split("\n\n").map((line: string) => line.split(/(\d+)/));
      this.toastr.success('Información cargada', '¡BIEN!');
      
      // Envolvemos el cambio de estado en setTimeout para salir del ciclo de detección actual de Angular
      setTimeout(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      });
    }, (error: any) => {
      console.error('Error fetching letter:', error[0] || error);
      setTimeout(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      });
      this.toastr.error(`Error fetching letter: ${error[0] || error} `, 'ERROR');
    });
  }

  isNumber(str: string): boolean {
    return !isNaN(Number(str)) && str.trim() !== '';
  }

  goToPage(pageName: string) {
    this.router.navigate([`${pageName}`]);
  }
}
