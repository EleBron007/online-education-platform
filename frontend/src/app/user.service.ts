import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cas, Korisnik, Msg, Predmet } from './models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string){
    const data={
      username: username,
      password: password
    }
    return this.http.post<Korisnik>("http://localhost:4000/users/login", data)
  }

  getKorisnik(username: string){
    const data={
      username: username,
    }
    return this.http.post<Korisnik>("http://localhost:4000/users/getKorisnik", data)
  }

  updateKorisnik(k: Korisnik){
    return this.http.post<Msg>("http://localhost:4000/users/updateKorisnik", k)
  }

  registerUcenik(k: Korisnik){
    return this.http.post<Msg>("http://localhost:4000/users/registerUcenik", k)
  }

  posaljiZahtev(k: Korisnik){
    return this.http.post<Msg>("http://localhost:4000/users/posaljiZahtev", k)
  }

  korak2(u: string, pr: string[], uz: string[], iz: string){
    const data={
      u: u,
      pr: pr,
      uz: uz,
      iz: iz
    }
    return this.http.post<Msg>("http://localhost:4000/users/korak2", data)
  }

  dodajSliku(username: string, file:File){
    const data: FormData = new FormData();
    data.append('username', username);
    data.append('file', file);
    console.log(data.get('username'))
    return this.http.post<Msg>("http://localhost:4000/users/dodajSliku", data)
  }

  dodajCV(username: string, file:File){
    const data: FormData = new FormData();
    data.append('username', username);
    data.append('file', file);
    return this.http.post<Msg>("http://localhost:4000/users/dodajCV", data)
  }

  dohvatiSliku(path: string) {
    return this.http.get(`http://localhost:4000/users/dohvatiSliku/${path}`, { responseType: 'blob' });
  }

  dohvatiCV(path: string) {
    return this.http.get(`http://localhost:4000/users/dohvatiCV/${path}`, { responseType: 'blob' });
  }

  promeniLozinku(username: string, oldp: string, newp: string){
    const data={
      oldp: oldp,
      newp: newp,
      username: username
    }
    console.log(data)
    return this.http.post<Msg>("http://localhost:4000/users/promeniLozinku", data)
  }

  getBrUcenika(){
    return this.http.post<Msg>("http://localhost:4000/users/getBrUcenika", null)
  }

  getNastavnici(){
    return this.http.post<Korisnik[]>("http://localhost:4000/users/getNastavnici", null)
  }

  getAllNastavnici(){
    return this.http.post<Korisnik[]>("http://localhost:4000/users/getAllNastavnici", null)
  }

  getAllUcenici(){
    return this.http.post<Korisnik[]>("http://localhost:4000/users/getAllUcenici", null)
  }

  getAllCasovi(){
    return this.http.post<Cas[]>("http://localhost:4000/users/getAllCasovi", null)
  }

  getCasovi(today: Date){
    const dateiso = today.toISOString()
    console.log(dateiso)
    return this.http.post<Cas[]>("http://localhost:4000/users/getCasovi", { today: dateiso })
  }

  getCasoviBuducnost(korime: String){
    return this.http.post<Cas[]>("http://localhost:4000/users/getCasoviBuducnost", { korime: korime })
  }

  napraviCas(cas: Cas){
    return this.http.post<Msg>("http://localhost:4000/users/napraviCas", cas)
  }


  getCasoviUcenik(ucenik: string){
    return this.http.post<Cas[]>("http://localhost:4000/users/getCasoviUcenik", {ucenik: ucenik})
  }

  getMojiUcenici(nastavnik: string){
    return this.http.post<Korisnik[]>("http://localhost:4000/users/getMojiUcenici", {nastavnik: nastavnik})
  }

  getZahtevi(nastavnik: string){
    return this.http.post<Cas[]>("http://localhost:4000/users/getZahtevi", {nastavnik: nastavnik})
  }

  getSviPredmeti(){
    return this.http.post<Predmet[]>("http://localhost:4000/users/getSviPredmeti", null)
  }

  getCasoviProslost(ucenik: string){
    return this.http.post<Cas[]>("http://localhost:4000/users/getCasoviProslost", {ucenik: ucenik})
  }

  odobriZahtev(cas: Cas){
    return this.http.post<Msg>("http://localhost:4000/users/odobriZahtev", cas)
  }

  odbijZahtev(cas: Cas){
    return this.http.post<Msg>("http://localhost:4000/users/odbijZahtev",cas)
  }

  komentarisiCas(cas: Cas){
    return this.http.post<Msg>("http://localhost:4000/users/komentarisiCas",cas)
  }

  odobriNastavnika(nastavnik: Korisnik){
    return this.http.post<Msg>("http://localhost:4000/users/odobriNastavnika", nastavnik)
  }

  blokirajNastavnika(nastavnik: Korisnik){
    return this.http.post<Msg>("http://localhost:4000/users/blokirajNastavnika", nastavnik)
  }

  dodajPredmet(predmet: String){
    console.log(predmet)
    return this.http.post<Msg>("http://localhost:4000/users/dodajPredmet", {predmet: predmet})
  }




}
