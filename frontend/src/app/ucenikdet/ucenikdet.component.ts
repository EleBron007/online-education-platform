import { ApplicationRef, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Cas, Korisnik } from '../models';

@Component({
  selector: 'app-ucenikdet',
  templateUrl: './ucenikdet.component.html',
  styleUrls: ['./ucenikdet.component.css']
})
export class UcenikdetComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private service: UserService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef,
    private appRef: ApplicationRef
  ) { }

  ucenik: Korisnik | undefined
  ucenikId: string = ""
  nastavnik: Korisnik | undefined
  prosliCasovi: Cas[] = []
  msg: string = ""
  slikab: any = null


  ngOnInit(){
    this.route.params.subscribe(params => {
      this.ucenikId = params['id'];
      this.service.getKorisnik(this.ucenikId).subscribe(details => {
        this.ucenik = details;
        this.nastavnik = JSON.parse(localStorage.getItem("logged")!)
        console.log(this.ucenik)
        console.log(this.nastavnik)
        this.service.getCasoviProslost(this.ucenik.korisnicko_ime).subscribe(data=>{
          this.prosliCasovi = data
          console.log(this.prosliCasovi)
          this.prosliCasovi = this.prosliCasovi.filter(c => {
            return c.nastavnik === this.nastavnik!.korisnicko_ime

          })
          console.log(this.prosliCasovi)
          this.service.dohvatiSliku(this.nastavnik?.profilna_slika_path!).subscribe((data) => {
            const urlCreator = window.URL || window.webkitURL;
            this.slikab = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(data));
          })
        })
      })
    })
  }

  updateCas(cas: Cas){
    if(cas.ocena == 0){
      this.msg = "Unesite ocenu"
      return
    }

    this.msg = ""
    cas.ocenjen = true
    this.service.komentarisiCas(cas).subscribe(data=>{
      console.log(data)

    })
  }
}
