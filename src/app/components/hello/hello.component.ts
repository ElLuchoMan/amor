import { Component, inject, OnInit } from '@angular/core';
import { SongsService } from '../../services/songs.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hello',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hello.component.html',
  styleUrl: './hello.component.scss'
})
export class HelloComponent implements OnInit{
  text: any;
  private songService = inject(SongsService);
  private router = inject(Router);

  ngOnInit(): void {
    this.getText();
    
  }

  getText(){
    this.songService.listSongs().subscribe((data:any)=>{
      this.text = data.text[0].letter.split("\n\n");
    })
  }
  goToPage(pageName: string){
    this.router.navigate([`${pageName}`]);
  }

}
