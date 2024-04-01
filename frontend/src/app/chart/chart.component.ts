import { Component, ViewChild, ElementRef, OnInit, Input } from '@angular/core';
import { Chart } from 'chart.js';
import { UserService } from '../user.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  @ViewChild('chartCanvas1') chartCanvas1!: ElementRef;
  @ViewChild('chartCanvas2') chartCanvas2!: ElementRef;
  @ViewChild('chartCanvas3') chartCanvas3!: ElementRef;
  @ViewChild('chartCanvas4') chartCanvas4!: ElementRef;
  @ViewChild('chartCanvas5') chartCanvas5!: ElementRef;
  @ViewChild('chartCanvas6') chartCanvas6!: ElementRef;
  @ViewChild('chartCanvas7') chartCanvas7!: ElementRef;
  @Input() chartData1: any;
  @Input() chartData2: any;
  @Input() chartData3: any;
  @Input() chartData4: any;
  @Input() chartData5: any;
  @Input() chartData6: any;
  @Input() chartData7: any;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.initializeChart1(this.chartData1);
    this.initializeChart2(this.chartData2);
    this.initializeChart3(this.chartData3);
    this.initializeChart4(this.chartData4);
    this.initializeChart5(this.chartData5);
    this.initializeChart6(this.chartData6);
    this.initializeChart7(this.chartData7);
  }


  initializeChart1(data: any) {
    const canvas = this.chartCanvas1.nativeElement.getContext('2d');
    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: data.labels, // Common labels for both datasets
        datasets: [
          {
            label: 'Nastavnici po predmetu',
            data: data.teacherCountsBySubject,
            backgroundColor: '#36A2EB',
          },
          {
            label: 'Nastavnici po uzrastu',
            data: data.teacherCountsByAgeGroup,
            backgroundColor: '#FFCE56',
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Broj nastavnika po predmetu i uzrastu',
          },
          legend: {
            display: true,
            position: 'top',
          },
        },
      }
    });
  }

  initializeChart2(data: any) {
    const canvas = this.chartCanvas2.nativeElement.getContext('2d');
    console.log(data)
    new Chart(canvas, {
      type: 'pie',
      data: {
        labels: data.labels,
        datasets: [
          {
            data: data.teacherCounts,
            backgroundColor: data.backgroundColor,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
      },
    });
  }

  initializeChart3(data: any) {
    console.log("AAAAAAAAAAAAAAA")
    const canvas = this.chartCanvas3.nativeElement.getContext('2d');
    console.log(data)
    new Chart(canvas, {
      type: 'pie',
      data: {
        labels: data.labels,
        datasets: [
          {
            data: data.studentCounts,
            backgroundColor: data.backgroundColor,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
      },
    });
  }

  initializeChart4(data: any) {
    const canvas = this.chartCanvas4.nativeElement.getContext('2d');

    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Prosecan broj casova',
            data: data.datasets[0].data,
            backgroundColor: data.datasets[0].backgroundColor,
            borderColor: data.datasets[0].borderColor,
            borderWidth: data.datasets[0].borderWidth,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
      },
    });
  }

  initializeChart5(data: any) {
    const canvas = this.chartCanvas5.nativeElement.getContext('2d');

    new Chart(canvas, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: data.datasets.map((dataset: any) => ({
          label: dataset.label,
          data: dataset.data,
          fill: false,
          borderColor: dataset.borderColor,
          borderWidth: dataset.borderWidth,
        })),
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
      },
    });
  }

  initializeChart6(data: any) {
    const canvas = this.chartCanvas6.nativeElement.getContext('2d');

    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Accepted',
            data: data.datasets[0].data,
            backgroundColor: data.datasets[0].backgroundColor,
            borderColor: data.datasets[0].borderColor,
            borderWidth: data.datasets[0].borderWidth,
          },
          {
            label: 'Denied',
            data: data.datasets[1].data,
            backgroundColor: data.datasets[1].backgroundColor,
            borderColor: data.datasets[1].borderColor,
            borderWidth: data.datasets[1].borderWidth,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
      },
    });
  }

  initializeChart7(data: any) {
    const canvas = this.chartCanvas7.nativeElement.getContext('2d');

    new Chart(canvas, {
      type: 'pie',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.datasets[0].data,
          backgroundColor: data.datasets[0].backgroundColor,
        }],
      },
      options: {
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
      },
    });
  }

}
