import mongoose from 'mongoose'

const casSchema = new mongoose.Schema(
    {
        nastavnik: String,
        nastavnikPI: String,
        ucenik: String,
        ucenikPI: String,
        predmet: String,
        komentar: String,
        ocena: Number,
        vremeod:  String,
        vremedo: String,
        dupli: Boolean,
        prihvacen: String,
        obrazlozenje: String,
        ocenjen: Boolean
    },{
      versionKey:false  
    }
);

export default mongoose.model('CModel', 
casSchema, 'casovi');


