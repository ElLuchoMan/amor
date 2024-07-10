import { Component, inject, OnInit } from '@angular/core';
import { SongsService } from '../../services/songs.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
  selector: 'app-hello',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.scss']
})
export class HelloComponent implements OnInit {
  text: any;
  isLoading = true;
  private songService = inject(SongsService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  ngOnInit(): void {
    this.getText();
  }

  getText() {
    this.songService.listText().subscribe((data: any) => {
      this.text = data.text[0].letter.split("\n\n");
      this.toastr.success('Información cargada', '¡BIEN!');
      this.isLoading = false;

    }, (error: any) => {
      console.error('Error fetching letter:', error);
      this.isLoading = false;
      this.toastr.error(`Error fetching letter: ${error[0]||error} `, 'ERROR');
    });
  }

  goToPage(pageName: string) {
    this.router.navigate([`${pageName}`]);
  }
}
