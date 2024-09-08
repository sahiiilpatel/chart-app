import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-view-data',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './view-data.component.html',
  styleUrls: ['./view-data.component.scss']
})
export class ViewDataComponent implements OnInit, AfterViewInit {
  chart: Chart | null = null;
  chartData: any[] = [];
  dataAvailable: boolean = false;

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    if (this.dataAvailable) {
      this.createChart();
    }
  }

  loadData(): void {
    const storedData = localStorage.getItem('addedData');
    console.log('storedData: ', storedData);
    if (storedData) {
      this.chartData = JSON.parse(storedData);
      this.dataAvailable = this.chartData.length > 0;
    }
  }

  createChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = this.chartData.map((entry: any) => {
      const date = new Date(entry.date);
      return date.toLocaleDateString();
    });

    const temperatureData = this.chartData.map((entry: any) => entry.temperature);

    const chartConfig: ChartConfiguration = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Temperature Data',
          data: temperatureData,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          x: {
            type: 'category',
            title: {
              display: true,
              text: 'Date'
            },
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Temperature'
            },
            ticks: {
              stepSize: 5
            }
          }
        }
      }
    };

    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        this.chart = new Chart(ctx, chartConfig);
      }
    }
  }
}
