import { Component, inject, OnInit } from '@angular/core';
import { SongsService } from '../services/songs.service';

@Component({
  selector: 'app-hello',
  standalone: true,
  imports: [],
  templateUrl: './hello.component.html',
  styleUrl: './hello.component.scss'
})
export class HelloComponent implements OnInit{

  private songService = inject(SongsService);

  ngOnInit(): void {
    //this.getSongs();
  }

  getSongs(){
    this.songService.listSongs().subscribe(data=>{
      console.log(data);
    })
  }

}
