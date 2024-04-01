import express from 'express'
import KModel from '../models/korisnik'
import CModel from '../models/cas'
import PModel from '../models/predmet'
import * as crypto from 'crypto';
import multer from 'multer'
import path from 'path';
import * as fs from 'fs';
username: String
const saltLength = 16;
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, ('./src/uploads'));
     },
    filename: function (req, file, cb) {
        const originalnameSplit = file.originalname.split('.');
        const fileExtension = originalnameSplit[originalnameSplit.length - 1];
        const fileName = req.body.username + '.' + fileExtension
        //console.log("STORAGE")
        //console.log(req.body)
        cb(null, fileName);
    }
  });
const upload = multer({ storage: storage });


export class UserController{
    login = (req: express.Request, res: express.Response) => {
        const usernameP = req.body.username;
        const passwordP = req.body.password;
    
        KModel.findOne({ korisnicko_ime: usernameP }).then((user) => {
            if (!user) {
                return res.status(401).json({ error: 'Ne postoji korisnik' });
            }
    
            if (user.salt === null || user.salt === undefined) {
                return res.status(500).json({ error: 'User salt is missing' });
            }
    
            const hashedPassword = crypto.createHmac('sha256', user.salt).update(passwordP || '').digest('hex');
    
            if (hashedPassword === user.lozinka) {
                res.json(user);
            } else {
                res.status(401).json({ error: 'Pogresna lozinka' });
            }
        }).catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
    };

    getKorisnik = (req: express.Request, res: express.Response)=>{
        let usernameP = req.body.username;
        KModel.findOne({korisnicko_ime: usernameP}).then((data)=>{
            res.json(data)
        }).catch((err)=>{
            console.log(err)
        }) 
    }

    getSviPredmeti = (req: express.Request, res: express.Response)=>{
        PModel.find({}).then((data)=>{
            res.json(data)
        }).catch((err)=>{
            console.log(err)
        }) 
    }


    updateKorisnik = (req: express.Request, res: express.Response)=>{
        console.log(req.body)
        KModel.updateOne({korisnicko_ime: req.body.korisnicko_ime}, 
            {   ime: req.body.ime, 
                prezime: req.body.prezime, 
                adresa: req.body.adresa,
                email_adresa: req.body.email_adresa, 
                kontakt_telefon: req.body.kontakt_telefon,
                tip_skole: req.body.tip_skole, 
                trenutni_razred: req.body.trenutni_razred,
                uzrasti: req.body.uzrasti,
                predmeti: req.body.predmeti,
                izvorpitanje: req.body.izvorpitanje
        }).then((data)=>{
            res.json(data)
        }).catch((err)=>{
            console.log(err)
        })
    }

    registerUcenik = (req: express.Request, res: express.Response) => {
        const { korisnicko_ime, lozinka, ime, prezime, pol, adresa, kontakt_telefon, email_adresa, profilna_slika, tip_skole, trenutni_razred, bezbednosno_pitanje } = req.body;
        KModel.findOne({ $or: [{ korisnicko_ime }, { email_adresa }] }).then((existingUser) => {
            if (existingUser) {
                return res.status(400).json({ error: 'Korisnicko ime ili email adresa su iskoristeni' });
            }
            const salt = crypto.randomBytes(Math.ceil(saltLength / 2)).toString('hex').slice(0, saltLength);

            const hashedPassword = crypto.createHmac('sha256', salt).update(lozinka).digest('hex');

            
            new KModel({
                korisnicko_ime,
                lozinka: hashedPassword,
                salt: salt,
                ime,
                prezime,
                tip: "ucenik",
                pol,
                adresa,
                kontakt_telefon,
                email_adresa,
                profilna_slika,
                tip_skole,
                trenutni_razred,
                bezbednosno_pitanje: {
                    pitanje: bezbednosno_pitanje[0].pitanje,
                    odgovor: bezbednosno_pitanje[0].odgovor,
                },
            })
            .save()
            .then((data) => {
                res.json(data);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({ error: 'Internal Server Error' });
            });
        }).catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
    };
    

    posaljiZahtev = (req: express.Request, res: express.Response) => {
        const { korisnicko_ime, lozinka, ime, prezime, pol, adresa, kontakt_telefon, email_adresa, profilna_slika, tip_skole, trenutni_razred, bezbednosno_pitanje, status, uzrasti, predmeti, izvorpitanje } = req.body;
        KModel.findOne({ korisnicko_ime }).then((existingUser) => {
            if (existingUser) {
                return res.status(400).json({ error: 'Korisnicko ime je zauzeto' });
            }
            const salt = crypto.randomBytes(Math.ceil(saltLength / 2)).toString('hex').slice(0, saltLength);
            const hashedPassword = crypto.createHmac('sha256', salt).update(lozinka).digest('hex');
            console.log(req.body)
            new KModel({
                korisnicko_ime,
                lozinka: hashedPassword,
                salt: salt,
                ime,
                prezime,
                tip: "nastavnik",
                pol,
                adresa,
                kontakt_telefon,
                email_adresa,
                profilna_slika,
                tip_skole,
                trenutni_razred,
                bezbednosno_pitanje: {
                    pitanje: bezbednosno_pitanje[0].pitanje,
                    odgovor: bezbednosno_pitanje[0].odgovor,
                },
                status,
                predmeti,
                uzrasti,
                izvorpitanje
            })
            .save()
            .then((data) => {
                res.json(data);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({ error: 'Internal Server Error' });
            });
        }).catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
    };

    korak2 = (req: express.Request, res: express.Response)=>{
        console.log(req.body)
        KModel.updateOne({korisnicko_ime: req.body.u}, 
            {   predmeti: req.body.pr,
                uzrasti: req.body.uz,
                izvopitanje: req.body.iz,
                status: "pending"
                }).then((data)=>{
            res.json(data)
        }).catch((err)=>{
            console.log(err)
        })
    }


    dodajSliku = (req: express.Request, res: express.Response) => {
        
        upload.single('file')(req, res, (err) => {
          if (err instanceof multer.MulterError) {
            console.log(err);
            return res.status(500).json({ error: 'Error uploading file.' });
          } else if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Error uploading file.' });
          }
          console.log(req.file)
          const profilePicturePath = req.file ? req.file.filename : 'default.png';
          console.log(profilePicturePath)
          KModel.updateOne({ korisnicko_ime: req.body.username }, { profilna_slika_path: profilePicturePath })
            .then((data) => {
              res.json(data);
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({ error: 'Internal Server Error' });
            });
        });
    };


    dodajCV = (req: express.Request, res: express.Response) => {
        
        upload.single('file')(req, res, (err) => {
          if (err instanceof multer.MulterError) {
            console.log(err);
            return res.status(500).json({ error: 'Error uploading file.' });
          } else if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Error uploading file.' });
          }
          console.log(req.file)
          const CVPath = req.file ? req.file.filename : 'default.png';
          KModel.updateOne({ korisnicko_ime: req.body.username }, { cv_path: CVPath })
            .then((data) => {
              res.json(data);
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({ error: 'Internal Server Error' });
            });
        });
    };

    dohvatiSliku = (req: express.Request, res: express.Response) => {
        const imageName = req.params.path
        console.log(imageName)
        const imagePath = './src/uploads/'+imageName
        console.log("IMAGE PATH")
        console.log(imagePath)
        if (fs.existsSync(imagePath)) {
          const image = fs.readFileSync(imagePath);
          res.writeHead(200, { 'Content-Type': 'image/png' });
          res.end(image, 'binary');
        } else {
          const defaultImagePath = 'src/uploads/default.png'
          const defaultImage = fs.readFileSync(defaultImagePath);
          res.writeHead(200, { 'Content-Type': 'image/png' });
          res.end(defaultImage, 'binary');
        }
    };

    dohvatiCV = (req: express.Request, res: express.Response) => {
        const cvName = req.params.path;
        console.log(cvName)
        const cvPath = './src/uploads/' + cvName;
    
        if (fs.existsSync(cvPath)) {
            const cv = fs.readFileSync(cvPath);
            res.writeHead(200, { 'Content-Type': 'application/pdf' });
            res.end(cv, 'binary');
        } else {
            const defaultCVPath = 'src/uploads/default.pdf'; // Change the default PDF path if needed
            const defaultCV = fs.readFileSync(defaultCVPath);
            res.writeHead(200, { 'Content-Type': 'application/pdf' });
            res.end(defaultCV, 'binary');
        }
    };

    promeniLozinku = (req: express.Request, res: express.Response) => {
        console.log("PROMENI LOZINKU")
        console.log(req.body)
        const oldp = req.body.oldp;
        const newp = req.body.newp;
        const username = req.body.username
        
        KModel.findOne({ korisnicko_ime: username }).then((user) => {
            if (!user) {
                return res.status(401).json({ error: 'Ne postoji korisnik' });
            }
    
            if (user.salt === null || user.salt === undefined) {
                return res.status(500).json({ error: 'User salt is missing' });
            }
    
            const hashedPassword = crypto.createHmac('sha256', user.salt).update(oldp || '').digest('hex');
    
            if (hashedPassword === user.lozinka) {
                console.log("PASSWORD CHANGE")
                const salt = crypto.randomBytes(Math.ceil(saltLength / 2)).toString('hex').slice(0, saltLength);
                const hashedPassword = crypto.createHmac('sha256', salt).update(newp).digest('hex');

                KModel.updateOne({korisnicko_ime: username},{salt: salt, lozinka: hashedPassword})
                    .then((data) => {
                        res.json(data);
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500).json({ error: 'Internal Server Error' });
                    });
            } else {
                res.status(401).json({ error: 'Pogresna lozinka' });
            }
        }).catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
    };

    getBrUcenika = async (req: express.Request, res: express.Response) => {
        try {
            const count = await KModel.countDocuments({ tip: "ucenik" });
            res.json({ num: count });
        } catch (err) {
            console.error('Error counting ucenik instances:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    getNastavnici = (req: express.Request, res: express.Response)=>{
        KModel.find({tip: "nastavnik", status: "active"}).then((data)=>{
            res.json(data)
        }).catch((err)=>{
            console.log(err)
        }) 
    }

    getAllNastavnici = (req: express.Request, res: express.Response)=>{
        KModel.find({tip: "nastavnik"}).then((data)=>{
            res.json(data)
        }).catch((err)=>{
            console.log(err)
        }) 
    }

    getAllUcenici = (req: express.Request, res: express.Response)=>{
        KModel.find({tip: "ucenik"}).then((data)=>{
            res.json(data)
        }).catch((err)=>{
            console.log(err)
        }) 
    }

    getAllCasovi = (req: express.Request, res: express.Response)=>{
        CModel.find({}).then((data)=>{
            res.json(data)
        }).catch((err)=>{
            console.log(err)
        }) 
    }



    getCasovi = (req: express.Request, res: express.Response)=>{
        const today = new Date(req.body.today);
        const oneMonthAgo = new Date(today);
        console.log(oneMonthAgo)
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        console.log(oneMonthAgo)
        console.log(oneMonthAgo < today)
        CModel.find({
        }).then((data) => {
            const filteredData = data.filter(cas => {
                const casDate = new Date(cas!.vremeod!);
                console.log(casDate)
                return casDate >= oneMonthAgo && casDate < today;
            });
            res.json(filteredData);
        }).catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
    }

    getCasoviBuducnost = (req: express.Request, res: express.Response)=>{
        const today = new Date();
        const korime = req.body.korime
        console.log(korime)
        CModel.find({nastavnik: korime
        }).then((data) => {
            const filteredData = data.filter(cas => {
                const casDate = new Date(cas!.vremeod!);
                console.log(casDate)
                return  casDate > today;
            })
            
            res.json(filteredData);
        }).catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
    }

    getCasoviUcenik = (req: express.Request, res: express.Response)=>{
        const today = new Date();
        const korime = req.body.ucenik
        console.log(korime)
        CModel.find({ucenik: korime
        }).then((data) => {
            res.json(data);
        }).catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
    }

    getZahtevi = (req: express.Request, res: express.Response)=>{
        const korime = req.body.nastavnik
        console.log(korime)
        CModel.find({nastavnik: korime, prihvacen: "pending"
        }).then((data) => {
            console.log(data)
            res.json(data);
        }).catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
    }

    getCasoviProslost = (req: express.Request, res: express.Response)=>{
        const korime = req.body.ucenik
        console.log(korime)
        CModel.find({ucenik: korime, prihvacen: "accepted"
        }).then((data) => {
            const data1 = data.filter(cas => new Date(cas.vremeod!) < new Date())
            console.log(data1)
            res.json(data1);
        }).catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
    }

    odobriZahtev = (req: express.Request, res: express.Response)=>{
        const cas = req.body
        console.log(cas)
        CModel.updateOne({nastavnik: cas.nastavnik, 
            ucenik: cas.ucenik, 
            prihvacen: "pending",
            vremeod: cas.vremeod
        }, {prihvacen: "accepted"})
        .then((data) => {
            console.log(data)
            res.json(data);
        }).catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
    }

    odbijZahtev = (req: express.Request, res: express.Response)=>{
        const cas = req.body
        console.log(cas)
        CModel.updateOne({nastavnik: cas.nastavnik, 
            ucenik: cas.ucenik, 
            prihvacen: "pending",
            vremeod: cas.vremeod
        }, {prihvacen: "denied",
            obrazlozenje: cas.obrazlozenje})
        .then((data) => {
            console.log(data)
            res.json(data);
        }).catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
    }

    komentarisiCas = (req: express.Request, res: express.Response)=>{
        const cas = req.body
        console.log(cas)
        CModel.updateOne({nastavnik: cas.nastavnik, 
            ucenik: cas.ucenik, 
            vremeod: cas.vremeod}, 
            {ocena: cas.ocena,
            obrazlozenje: cas.obrazlozenje,
            ocenjen: cas.ocenjen
            })
        .then((data) => {
            console.log(data)
            res.json(data);
        }).catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
    }



    napraviCas = (req: express.Request, res: express.Response) =>{
        const cas = req.body
        console.log(cas)
        new CModel(cas).save().then(data=>{
            console.log(data)
            res.json(data)
        }).catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
    }

    getMojiUcenici = async (req: express.Request, res: express.Response) =>{
        try {
            const nastavnik = req.body.nastavnik;
            console.log(nastavnik)
            const casovi = await CModel.find({
                nastavnik: nastavnik,
                prihvacen: 'accepted', 
            })
            
            console.log(casovi)
            const proslicasovi = casovi.filter(c =>  new Date(c.vremedo!) < new Date())
            console.log(proslicasovi)
            const ucenikKorisnickaImena = [...new Set(proslicasovi.map(cas => cas.ucenik))];

            
            const mojiUcenici = await KModel.find({
                tip: 'ucenik',
                korisnicko_ime: { $in: ucenikKorisnickaImena }
            });
    
            res.json(mojiUcenici);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }

    odobriNastavnika = (req: express.Request, res: express.Response)=>{
        const nastavnik = req.body.korisnicko_ime
        console.log(nastavnik)
        KModel.updateOne({korisnicko_ime: nastavnik,
        }, {status: "active"})
        .then((data) => {
            console.log(data)
            res.json(data);
        }).catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
    }

    blokirajNastavnika = (req: express.Request, res: express.Response)=>{
        const nastavnik = req.body.korisnicko_ime
        console.log(nastavnik)
        KModel.updateOne({korisnicko_ime: nastavnik,
        }, {status: "blocked"})
        .then((data) => {
            console.log(data)
            res.json(data);
        }).catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
    }

    dodajPredmet = (req: express.Request, res: express.Response) =>{
        const p = req.body.predmet
        console.log("Predmet:")
        console.log(p)
        new PModel({predmet: p}).save().then((data) => {
            console.log(data)
            res.json(data);
        }).catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
    }


}