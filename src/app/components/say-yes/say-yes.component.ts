import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SongsService } from '../../services/songs.service';

@Component({
  selector: 'app-say-yes',
  standalone: true,
  imports: [],
  templateUrl: './say-yes.component.html',
  styleUrl: './say-yes.component.scss'
})
export class SayYesComponent implements OnInit {
  ngOnInit() {
    this.getIamge();
  }

  private router = inject(Router);
  private service = inject(SongsService);

  image = '../../../assets/imagen.jpeg';

  goToPage(pageName: string){
    this.router.navigate([`${pageName}`]);
  }
  getIamge(){
    this.service.listSongs().subscribe((data:any)=>{
      this.image = data.image;
      console.log(data.image);
    })
  }

  salirDePagina(){
    window.location.href = 'https://youtu.be/7oKZeo779Xg?si=4SM-GqgcJYqmGLNw&t=103';
  }
}
