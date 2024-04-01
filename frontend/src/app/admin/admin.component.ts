import { Component, OnInit } from '@angular/core';
import { Cas, Korisnik, Predmet } from '../models';
import { UserService } from '../user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit{

  korisnik: Korisnik | undefined
  allNastavnici: Korisnik[] = []
  allUcenici: Korisnik [] = []
  allCasovi: Cas[] = []
  allZahtevi: Korisnik[] = []
  chartData1: any;
  chartData2: any;
  chartData3: any;
  chartData4: any
  chartData5: any
  chartData6: any
  chartData7: any
  allPredmeti: Predmet[] =[]
  specijalniPredmeti: string[] = []
  cvDataMap: { [key: string]: any } = {};



  sviuzrasti: string[] = [
    'osnovna 1-4', 'osnovna 5-8', 'srednja'
  ];

  constructor(private router: Router, private service: UserService, private sanitizer: DomSanitizer){}

  ngOnInit() {
    const loggedUser = JSON.parse(localStorage.getItem('logged')!);
    console.log(loggedUser)
    if (loggedUser && loggedUser.tip === 'admin') {
      this.korisnik = loggedUser;
    }
    console.log(this.korisnik)

    this.service.getKorisnik(this.korisnik!.korisnicko_ime).subscribe(data =>{
      this.korisnik = data
      this.service.getAllNastavnici().subscribe(data=>{
        this.allNastavnici = data
        this.allZahtevi = [...this.allNastavnici].filter(n=> n.status=='pending')
        this.service.getAllUcenici().subscribe(data=>{
          this.allUcenici = data
          this.service.getAllCasovi().subscribe(data=>{
            this.allCasovi = data
            this.service.getSviPredmeti().subscribe(data =>{
              this.allPredmeti = data
              this.prepareChartData1();
              this.prepareChartData2();
              this.prepareChartData3();
              this.prepareChartData4();
              this.prepareChartData5();
              this.prepareChartData6();
              this.prepareChartData7();
              console.log(this.allPredmeti)
              this.specijalniPredmeti = [...new Set([...this.allNastavnici.map(nastavnik => nastavnik.predmeti).flat().filter(predmet => ![...this.allPredmeti].some(p => p.predmet === predmet))])];
              console.log("SPECIJALNI PREDMETI")
            })
          })
        })
      })
    })

  }

  blokirajNastavnik(nastavnik: Korisnik){
    this.service.blokirajNastavnika(nastavnik).subscribe(data=>{
      console.log(data)
      this.ngOnInit()
    })
  }

  odobriNastavnik(nastavnik: Korisnik){
    this.service.odobriNastavnika(nastavnik).subscribe(data=>{
      console.log(data)
      this.ngOnInit()
    })
  }

  izmeniNastavnik(nastavnik: Korisnik){
    localStorage.setItem("korisnikUpdate", JSON.stringify(nastavnik))
    this.router.navigate(['korisnikupdate'])
  }

  prepareChartData1() {
    console.log(this.allPredmeti)
    const predmeti = [...this.allPredmeti];
    const uzrasti = [...this.sviuzrasti];


    const brojNastPoPred: number[] = [];
    const allTeachers: Korisnik[] = this.allNastavnici;
    console.log("PREDMETI")
    console.log(predmeti)
    console.log(this.allPredmeti)
    predmeti.forEach(subject => {
      const teachersForSubject = [...allTeachers].filter(teacher => teacher.predmeti.includes(subject.predmet));
      brojNastPoPred.push(teachersForSubject.length);
    });

    const brojNastPoUzr: number[] = [];

    uzrasti.forEach(ageGroup => {
      const teachersForAgeGroup = [...allTeachers].filter(teacher => teacher.uzrasti.includes(ageGroup));
      brojNastPoUzr.push(teachersForAgeGroup.length);
    });

    const l = brojNastPoUzr.length + brojNastPoPred.length

    while (brojNastPoUzr.length < l) {
      brojNastPoUzr.unshift(0);
    }

    const chartData = {
      labels: [...predmeti.map(predmet => predmet.predmet), ...uzrasti],
      datasets: [
        {
          label: 'Nastavnici po predmetu',
          data: brojNastPoPred,
          backgroundColor: '#36A2EB',
        },
        {
          label: 'Nastavnici po uzrastu',
          data: brojNastPoUzr,
          backgroundColor: '#FFCE56',
        },
      ],
    };
    this.chartData1 = chartData;

  }

  prepareChartData2() {
    const allTeachers: Korisnik[] = this.allNastavnici;

    const maleTeachers = [...allTeachers].filter(teacher => teacher.pol === 'M').length;
    const femaleTeachers = [...allTeachers].filter(teacher => teacher.pol === 'Z').length;

    this.chartData2 = {
      labels: ['Muskarci', 'Zene'],
      teacherCounts: [maleTeachers, femaleTeachers],
      datasets: [
        {
          data: [maleTeachers, femaleTeachers],
          backgroundColor: ['#36A2EB', '#FF6384'],
        },
      ],
    };
  }


  prepareChartData3() {
    const ucenici: Korisnik[] = [...this.allUcenici];

    const maleUcenici = ucenici.filter(u => u.pol === 'M').length;
    const femaleUcenici = ucenici.filter(u => u.pol === 'Z').length;

    this.chartData3 = {
      labels: ['Muskarci', 'Zene'],
      studentCounts: [maleUcenici, femaleUcenici],
      datasets: [
        {
          data: [maleUcenici, femaleUcenici],
          backgroundColor: ['#36A2EB', '#FF6384'],
        },
      ],
    };
    console.log(this.chartData3)
  }

  prepareChartData4() {
    const daysOfWeek = ['Nedelja', 'Ponedeljak', 'Utorak', 'Sreda', 'Cetvrtak', 'Petak', 'Subota'];
    const classCountsByDay = [0, 0, 0, 0, 0, 0, 0];
    const occurrencesByDay = [0, 0, 0, 0, 0, 0, 0];

    this.allCasovi.forEach(cas => {
      const date = new Date(cas.vremeod);
      const dayOfWeek = date.getDay();


      if (date.getFullYear() === 2023 && cas.prihvacen === "accepted") {
        classCountsByDay[dayOfWeek]++;
        occurrencesByDay[dayOfWeek]++;
      }
    });

    const averageClassCountsByDay = classCountsByDay.map((count, index) => {
      const occurrences = occurrencesByDay[index];
      return occurrences === 0 ? 0 : count / 52;
    });

    const chartData = {
      labels: daysOfWeek,
      datasets: [
        {
          label: 'Prosecan broj casova',
          data: averageClassCountsByDay,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };

    this.chartData4 = chartData;
  }

  prepareChartData5() {
    this.allNastavnici.forEach(nastavnik => {
      nastavnik.brCasova = 0;
    });

    this.allCasovi.forEach(cas => {
      if (cas.prihvacen === 'accepted' && new Date(cas.vremeod).getFullYear() == 2023) {
        const korisnicko_ime = cas.nastavnik;
        const nastavnik = this.allNastavnici.find(n => n.korisnicko_ime === korisnicko_ime);

        if (nastavnik) {
          nastavnik.brCasova++;
        }
      }
    });

    this.allNastavnici.sort((a, b) => (b.brCasova || 0) - (a.brCasova || 0));
    const top10Nastavnika = this.allNastavnici.slice(0, 10);

    const months = [
      'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'
    ];

    const dataByTeacher = top10Nastavnika.map(teacher => {
      const brCasovaPoMesecu = Array(12).fill(0);

      this.allCasovi.forEach(cas => {
        const date = new Date(cas.vremeod);

        if (
          date.getFullYear() == 2023 &&
          cas.nastavnik == teacher.korisnicko_ime &&
          cas.prihvacen == 'accepted'
        ) {
          const month = date.getMonth();
          brCasovaPoMesecu[month]++;
        }
      });

      return {
        teacherName: teacher.korisnicko_ime,
        brCasovaPoMesecu: brCasovaPoMesecu,
        borderColor: this.getRandomColor(),
      };
    });

    const chartData = {
      labels: months,
      datasets: dataByTeacher.map(teacherData => ({
        label: teacherData.teacherName,
        data: teacherData.brCasovaPoMesecu,
        fill: false,
        borderColor: teacherData.borderColor,
      })),
    };

    this.chartData5 = chartData;
  }

  prepareChartData6() {
    const months = [
      'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'
    ];

    const monthData: { [key: string]: { accepted: number, denied: number } } = {};
    months.forEach(month => {
      monthData[month] = { accepted: 0, denied: 0 };
    });

    this.allCasovi.forEach(cas => {
      const date = new Date(cas.vremeod);
      const month = months[date.getMonth()];
      const status = cas.prihvacen === 'accepted' ? 'accepted' : 'denied';
      monthData[month][status]++;
    });

    const chartLabels = months;
    const chartData = {
      labels: chartLabels,
      datasets: [
        {
          label: 'Odrzani',
          data: chartLabels.map(label => monthData[label].accepted),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Neodrzani', // odbijeni ili neodgovoreni u proslosti
          data: chartLabels.map(label => monthData[label].denied),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };

    this.chartData6 = chartData;
  }

  prepareChartData7() {
    let acceptedCount = 0;
    let pendingCount = 0;
    let deniedCount = 0;

    this.allCasovi.forEach(cas => {
      if (cas.prihvacen === 'accepted') {
        acceptedCount++;
      } else if (cas.prihvacen === 'pending') {
        pendingCount++;
      } else if (cas.prihvacen === 'denied') {
        deniedCount++;
      }
    });

    const chartData = {
      labels: ['Prihvaceni', 'Na cekanju', 'Odbijeni'],
      datasets: [{
        data: [acceptedCount, pendingCount, deniedCount],
        backgroundColor: ['#36A2EB', '#FFCE56', '#FF5733'],
      }],
    };

    this.chartData7 = chartData;
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  newPredmet: string = "";
  msg: string = ""
  addNewPredmet(): void {
    console.log(this.allPredmeti)
    console.log(this.newPredmet)
    if(this.newPredmet == ""){
      this.msg = "Polje ne sme biti prazno"
      return;
    }
    if(this.allPredmeti.some(p => p.predmet === this.newPredmet)){
      this.msg = "Predmet vec postoji"
      return;
    }
    console.log("PREDMET")
    console.log(this.newPredmet)
    this.service.dodajPredmet(this.newPredmet).subscribe(data=>{
      console.log(data)
      this.msg = "Uspeh"
      this.ngOnInit();
    })
  }

  addNewPredmet1(predmet: string){
    this.service.dodajPredmet(predmet).subscribe(data=>{
      console.log(data)
      this.msg = "Uspeh"
      this.ngOnInit();
    })
  }

  preuzmiCV(nastavnik: Korisnik) {
    console.log(nastavnik)
    this.service.dohvatiCV(nastavnik.cv_path).subscribe(cvData => {
      const blob = new Blob([cvData], { type: 'application/pdf' });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `CV_${nastavnik.korisnicko_ime}.pdf`;

      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    });
  }


}
