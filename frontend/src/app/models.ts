export class Msg{
  msg: string = "";
  num: number = 0;
}

export class Korisnik{

  korisnicko_ime: string = "";
  lozinka: string = "";
  tip: string = ""
  ime: string = "";
  prezime: string = "";
  pol: string = "";
  adresa: string = "";
  kontakt_telefon: string = "";
  email_adresa: string = "";
  profilna_slika: File = new File([], "");
  profilna_slika_path: string = ""
  cv_path: string = "";
  tip_skole: string = "";
  trenutni_razred: number = 0;
  bezbednosno_pitanje: Pitanje[] = []
  predmeti: string[] = [];
  uzrasti: string[] = [];
  status: string = "" // active, pending, blocked, incomplete
  izvorpitanje: string = ""
  brCasova: number = 0;
  ocena: number = 0
}

export class Pitanje{
  pitanje: string = ""
  odgovor: string = ""
}

export class Cas{
  nastavnik: string = "";
  nastavnikPI: string = "";
  ucenik: string = "";
  ucenikPI: string = "";
  predmet: string = "";
  komentar: string = "";
  ocena: number = 0;
  vremeod: string = ""
  vremedo: string = ""
  dupli: boolean = false
  prihvacen: string = ""  // pending, accepted, denied
  obrazlozenje: string = ""
  ocenjen: boolean = false

}

export class Predmet{
  predmet: string = ""
  profesor: string[] = []
}
