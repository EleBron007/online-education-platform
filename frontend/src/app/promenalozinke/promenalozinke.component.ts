import { Component } from '@angular/core';
import { Korisnik } from '../models';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-promenalozinke',
  templateUrl: './promenalozinke.component.html',
  styleUrls: ['./promenalozinke.component.css']
})
export class PromenalozinkeComponent {
  //korisnik: Korisnik | null = null;
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  username: string = ""
  msg: string = '';
  promena: boolean = true

  constructor(private router: Router, private service: UserService) {
  }

  promeniLozinku(): void {
    if(this.oldPassword =="" || this.newPassword == "" || this.confirmPassword == ""){
      this.msg = "Sva polja su obavezna"
      return;
    }
    const passwordRegex = /^(?=[A-Za-z])(?=.*[A-Z])(?=.*[a-z].*[a-z].*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,10}$/;
    if (!passwordRegex.test(this.newPassword)) {
      this.msg = 'Lozinka ne zadovoljava zahteve';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.msg = 'Nova lozinka i potvrda lozinke se ne poklapaju.';
      return;
    }
    this.msg = ""
    this.service.promeniLozinku(this.username, this.oldPassword, this.newPassword).subscribe((data)=>{
      console.log(data)
      this.msg = 'Uspeh';
      this.promena = false
      //this.router.navigate([''])
    }, error=>{
      console.log(error.error.error)
      this.msg = error.error.error
    })

  }

  pocetna(){
    this.router.navigate([''])
  }
}
