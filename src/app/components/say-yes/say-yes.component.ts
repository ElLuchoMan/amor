import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-say-yes',
  standalone: true,
  imports: [],
  templateUrl: './say-yes.component.html',
  styleUrl: './say-yes.component.scss'
})
export class SayYesComponent {
  private router = inject(Router);

  goToPage(pageName: string){
    this.router.navigate([`${pageName}`]);
  }
}
