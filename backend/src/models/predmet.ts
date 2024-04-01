import mongoose from 'mongoose'

const predmetSchema = new mongoose.Schema(
    {
        predmet: String,
        nastavnik: Array
    },{
      versionKey:false  
    }
);

export default mongoose.model('PModel', 
predmetSchema, 'predmeti');


