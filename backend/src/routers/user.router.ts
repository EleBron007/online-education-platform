import express from 'express'
import { UserController } from '../controllers/user.controller'

const userRouter = express.Router()

userRouter.route("/login").post(
    (req,res)=>new UserController().login(req,res)
)

userRouter.route("/getKorisnik").post(
    (req,res)=>new UserController().getKorisnik(req,res)
)

userRouter.route("/updateKorisnik").post(
    (req,res)=>new UserController().updateKorisnik(req,res)
)

userRouter.route("/registerUcenik").post(
    (req,res)=>new UserController().registerUcenik(req,res)
)

userRouter.route("/posaljiZahtev").post(
    (req,res)=>new UserController().posaljiZahtev(req,res)
)

userRouter.route("/korak2").post(
    (req,res)=>new UserController().korak2(req,res)
)

userRouter.route("/dodajSliku").post(
    (req,res)=>new UserController().dodajSliku(req,res)
)

userRouter.route("/dodajCV").post(
    (req,res)=>new UserController().dodajCV(req,res)
)

userRouter.route("/dohvatiSliku/:path").get(
    (req,res)=>new UserController().dohvatiSliku(req,res)
)

userRouter.route("/promeniLozinku").post(
    (req,res)=>new UserController().promeniLozinku(req,res)
)

userRouter.route("/getBrUcenika").post(
    (req,res)=>new UserController().getBrUcenika(req,res)
)

userRouter.route("/getNastavnici").post(
    (req,res)=>new UserController().getNastavnici(req,res)
)

userRouter.route("/getAllNastavnici").post(
    (req,res)=>new UserController().getAllNastavnici(req,res)
)

userRouter.route("/getAllUcenici").post(
    (req,res)=>new UserController().getAllUcenici(req,res)
)

userRouter.route("/getAllCasovi").post(
    (req,res)=>new UserController().getAllCasovi(req,res)
)

userRouter.route("/getCasovi").post(
    (req,res)=>new UserController().getCasovi(req,res)
)

userRouter.route("/getCasoviBuducnost").post(
    (req,res)=>new UserController().getCasoviBuducnost(req,res)
)

userRouter.route("/getCasoviUcenik").post(
    (req,res)=>new UserController().getCasoviUcenik(req,res)
)

userRouter.route("/getSviPredmeti").post(
    (req,res)=>new UserController().getSviPredmeti(req,res)
)

userRouter.route("/getZahtevi").post(
    (req,res)=>new UserController().getZahtevi(req,res)
)

userRouter.route("/odbijZahtev").post(
    (req,res)=>new UserController().odbijZahtev(req,res)
)

userRouter.route("/odobriZahtev").post(
    (req,res)=>new UserController().odobriZahtev(req,res)
)

userRouter.route("/odobriNastavnika").post(
    (req,res)=>new UserController().odobriNastavnika(req,res)
)

userRouter.route("/blokirajNastavnika").post(
    (req,res)=>new UserController().blokirajNastavnika(req,res)
)

userRouter.route("/komentarisiCas").post(
    (req,res)=>new UserController().komentarisiCas(req,res)
)

userRouter.route("/napraviCas").post(
    (req,res)=>new UserController().napraviCas(req,res)
)

userRouter.route("/getMojiUcenici").post(
    (req,res)=>new UserController().getMojiUcenici(req,res)
)

userRouter.route("/getCasoviProslost").post(
    (req,res)=>new UserController().getCasoviProslost(req,res)
)

userRouter.route("/dodajPredmet").post(
    (req,res)=>new UserController().dodajPredmet(req,res)
)

userRouter.route("/dohvatiCV/:path").get(
    (req,res)=>new UserController().dohvatiCV(req,res)
)




export default userRouter;