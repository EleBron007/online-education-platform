import mongoose from 'mongoose'

const korisnikSchema = new mongoose.Schema(
    {
      korisnicko_ime: String,
      lozinka: String,
      tip: String,
      ime: String,
      prezime: String,
      pol: String,
      adresa: String,
      kontakt_telefon: String,
      email_adresa: String,
      profilna_slika_path: String,
      cv_path: String,
      tip_skole: String,
      trenutni_razred: Number,
      bezbednosno_pitanje: Array,
      salt: String,
      predmeti: Array,
      uzrasti: Array,
      status: String,
      izvorpitanje: String,
      ocena: Number
    },{
      versionKey:false  
    }
);

export default mongoose.model('KModel', 
korisnikSchema, 'korisnici');