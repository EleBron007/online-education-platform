import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adminpocetna',
  templateUrl: './adminpocetna.component.html',
  styleUrls: ['./adminpocetna.component.css']
})
export class AdminpocetnaComponent {
  constructor(private servis: UserService,
    private router: Router){}

  username: string = ""
  password: string = ""
  msg: string = ""

  login(){
    if(this.username=="" || this.password==""){
      this.msg="NISU UNET SVI PODACI"
      return;
    }
    this.servis.login(this.username, this.password).subscribe(
      data=>{
        if(data==null){
          this.msg="NEMA KORISNIKA"
          return;
        }
        else {
          console.log(data)
          if(data.tip != "admin"){
            this.msg = "POGRESAN TIP"
            return;
          }
          this.msg = ""
          localStorage.setItem("logged", JSON.stringify(data))
          this.router.navigate(['admin'])
        }
      }, error=>{
        this.msg = error.error.error
      }
    )
  }
}
