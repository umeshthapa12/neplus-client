import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as Chart from 'chart.js';
import { shuffle } from 'lodash';
import { SparklineChartOptions, LayoutConfigService } from '../../../../../../../src/app/core/_base/layout';
import { Widget4Data } from '../../../../../../../src/app/views/partials/content/widgets/widget4/widget4.component';

@Component({
    selector: 'kt-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    chartOptions1: SparklineChartOptions;
    chartOptions2: SparklineChartOptions;
    chartOptions3: SparklineChartOptions;
    chartOptions4: SparklineChartOptions;
    widget4_1: Widget4Data;
    widget4_2: Widget4Data;
    widget4_3: Widget4Data;
    widget4_4: Widget4Data;

    type = 'line';
    @ViewChild('chart') chart: ElementRef;

    constructor(private layoutConfigService: LayoutConfigService) {
    }

    ngOnInit(): void {
        this.chartOptions1 = {
            data: [10, 14, 18, 11, 9, 12, 14, 17, 18, 14],
            color: this.layoutConfigService.getConfig('colors.state.brand'),
            border: 3
        };
        this.chartOptions2 = {
            data: [11, 12, 18, 13, 11, 12, 15, 13, 19, 15],
            color: this.layoutConfigService.getConfig('colors.state.danger'),
            border: 3
        };
        this.chartOptions3 = {
            data: [12, 12, 18, 11, 15, 12, 13, 16, 11, 18],
            color: this.layoutConfigService.getConfig('colors.state.success'),
            border: 3
        };
        this.chartOptions4 = {
            data: [11, 9, 13, 18, 13, 15, 14, 13, 18, 15],
            color: this.layoutConfigService.getConfig('colors.state.primary'),
            border: 3
        };

        // @ts-ignore
        this.widget4_1 = shuffle([
            {
                pic: './assets/media/files/doc.svg',
                title: 'Metronic Documentation',
                url: 'https://keenthemes.com.my/metronic',
            }, {
                pic: './assets/media/files/jpg.svg',
                title: 'Project Launch Evgent',
                url: 'https://keenthemes.com.my/metronic',
            }, {
                pic: './assets/media/files/pdf.svg',
                title: 'Full Developer Manual For 4.7',
                url: 'https://keenthemes.com.my/metronic',
            }, {
                pic: './assets/media/files/javascript.svg',
                title: 'Make JS Great Again',
                url: 'https://keenthemes.com.my/metronic',
            }, {
                pic: './assets/media/files/zip.svg',
                title: 'Download Ziped version OF 5.0',
                url: 'https://keenthemes.com.my/metronic',
            }, {
                pic: './assets/media/files/pdf.svg',
                title: 'Finance Report 2016/2017',
                url: 'https://keenthemes.com.my/metronic',
            },
        ]);
        // @ts-ignore
        this.widget4_2 = shuffle([
            {
                pic: './assets/media/users/100_4.jpg',
                username: 'Anna Strong',
                desc: 'Visual Designer,Google Inc.',
                url: 'https://keenthemes.com.my/metronic',
                buttonClass: 'btn-label-brand'
            }, {
                pic: './assets/media/users/100_14.jpg',
                username: 'Milano Esco',
                desc: 'Product Designer, Apple Inc.',
                url: 'https://keenthemes.com.my/metronic',
                buttonClass: 'btn-label-warning'
            }, {
                pic: './assets/media/users/100_11.jpg',
                username: 'Nick Bold',
                desc: 'Web Developer, Facebook Inc.',
                url: 'https://keenthemes.com.my/metronic',
                buttonClass: 'btn-label-danger'
            }, {
                pic: './assets/media/users/100_1.jpg',
                username: 'Wilter Delton',
                desc: 'Project Manager, Amazon Inc.',
                url: 'https://keenthemes.com.my/metronic',
                buttonClass: 'btn-label-success'
            }, {
                pic: './assets/media/users/100_5.jpg',
                username: 'Nick Stone',
                desc: 'Visual Designer, Github Inc.',
                url: 'https://keenthemes.com.my/metronic',
                buttonClass: 'btn-label-dark'
            },
        ]);
        // @ts-ignore
        this.widget4_3 = shuffle([
            {
                icon: 'flaticon-pie-chart-1 kt-font-info',
                title: 'Metronic v6 has been arrived!',
                url: 'https://keenthemes.com.my/metronic',
                value: '+$500',
                valueColor: 'kt-font-info'
            }, {
                icon: 'flaticon-safe-shield-protection kt-font-success',
                title: 'Metronic community meet-up 2019 in Rome.',
                url: 'https://keenthemes.com.my/metronic',
                value: '+$1260',
                valueColor: 'kt-font-success'
            }, {
                icon: 'flaticon2-line-chart kt-font-danger',
                title: 'Metronic Angular 7 version will be landing soon..',
                url: 'https://keenthemes.com.my/metronic',
                value: '+$1080',
                valueColor: 'kt-font-danger'
            }, {
                icon: 'flaticon2-pie-chart-1 kt-font-primary',
                title: 'ale! Purchase Metronic at 70% off for limited time',
                url: 'https://keenthemes.com.my/metronic',
                value: '70% Off!',
                valueColor: 'kt-font-primary'
            }, {
                icon: 'flaticon2-rocket kt-font-brand',
                title: 'Metronic VueJS version is in progress. Stay tuned!',
                url: 'https://keenthemes.com.my/metronic',
                value: '+134',
                valueColor: 'kt-font-brand'
            }, {
                icon: 'flaticon2-notification kt-font-warning',
                title: 'Black Friday! Purchase Metronic at ever lowest 90% off for limited time',
                url: 'https://keenthemes.com.my/metronic',
                value: '70% Off!',
                valueColor: 'kt-font-warning'
            }, {
                icon: 'flaticon2-file kt-font-focus',
                title: 'Metronic React version is in progress.',
                url: 'https://keenthemes.com.my/metronic',
                value: '+13%',
                valueColor: 'kt-font-focus'
            },
        ]);
        // @ts-ignore
        this.widget4_4 = shuffle([
            {
                pic: './assets/media/client-logos/logo5.png',
                title: 'Trump Themes',
                desc: 'Make Metronic Great Again',
                url: 'https://keenthemes.com.my/metronic',
                value: '+$2500',
                valueColor: 'kt-font-brand'
            }, {
                pic: './assets/media/client-logos/logo4.png',
                title: 'StarBucks',
                desc: 'Good Coffee & Snacks',
                url: 'https://keenthemes.com.my/metronic',
                value: '-$290',
                valueColor: 'kt-font-brand'
            }, {
                pic: './assets/media/client-logos/logo3.png',
                title: 'Phyton',
                desc: 'A Programming Language',
                url: 'https://keenthemes.com.my/metronic',
                value: '+$17',
                valueColor: 'kt-font-brand'
            }, {
                pic: './assets/media/client-logos/logo2.png',
                title: 'GreenMakers',
                desc: 'Make Green Great Again',
                url: 'https://keenthemes.com.my/metronic',
                value: '-$2.50',
                valueColor: 'kt-font-brand'
            }, {
                pic: './assets/media/client-logos/logo1.png',
                title: 'FlyThemes',
                desc: 'A Let\'s Fly Fast Again Language',
                url: 'https://keenthemes.com.my/metronic',
                value: '+200',
                valueColor: 'kt-font-brand'
            },
        ]);


        const color = Chart.helpers.color;
        const data = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Dec'],
            datasets: [
                {
                    fill: true,
                    // borderWidth: 0,
                    backgroundColor: color(this.layoutConfigService.getConfig('colors.state.info')).alpha(0.6).rgbString(),
                    borderColor: color(this.layoutConfigService.getConfig('colors.state.brand')).alpha(0.2).rgbString(),

                    pointHoverRadius: 4,
                    pointHoverBorderWidth: 12,
                    pointBackgroundColor: Chart.helpers.color('#000000').alpha(0.3).rgbString(),
                    pointBorderColor: Chart.helpers.color('#000000').alpha(0.1).rgbString(),
                    pointHoverBackgroundColor: this.layoutConfigService.getConfig('colors.state.brand'),
                    pointHoverBorderColor: Chart.helpers.color('#000000').alpha(0.1).rgbString(),

                    data: [25, 45, 55, 30, 40, 65, 35, 20, 25, 15, 100]
                }
            ]
        };


        this.initChart(data);
    }

    private initChart(data: { labels: string[], datasets: any[] }) {
        // For more information about the chartjs, visit this link
        // https://www.chartjs.org/docs/latest/getting-started/usage.html

        // const chart = new Chart(this.chart.nativeElement, {
        //     type: this.type,
        //     data,
        //     options: {
        //         responsive: true,
        //         maintainAspectRatio: false,
        //         legend: false,
        //         scales: {
        //             xAxes: [{
        //                 categoryPercentage: 0.35,
        //                 barPercentage: 0.70,
        //                 display: true,
        //                 scaleLabel: {
        //                     display: false,
        //                     labelString: 'Month'
        //                 },
        //                 gridLines: false,
        //                 ticks: {
        //                     display: true,
        //                     beginAtZero: true,
        //                     fontColor: this.layoutConfigService.getConfig('colors.base.shape.3'),
        //                     fontSize: 13,
        //                     padding: 10
        //                 }
        //             }],
        //             yAxes: [{
        //                 categoryPercentage: 0.35,
        //                 barPercentage: 0.70,
        //                 display: true,
        //                 scaleLabel: {
        //                     display: false,
        //                     labelString: 'Value'
        //                 },
        //                 gridLines: {
        //                     color: this.layoutConfigService.getConfig('colors.base.shape.2'),
        //                     drawBorder: false,
        //                     offsetGridLines: false,
        //                     drawTicks: false,
        //                     borderDash: [3, 4],
        //                     zeroLineWidth: 1,
        //                     zeroLineColor: this.layoutConfigService.getConfig('colors.base.shape.2'),
        //                     zeroLineBorderDash: [3, 4]
        //                 },
        //                 ticks: {
        //                     max: 100,
        //                     stepSize: 10,
        //                     display: true,
        //                     beginAtZero: true,
        //                     fontColor: this.layoutConfigService.getConfig('colors.base.shape.3'),
        //                     fontSize: 13,
        //                     padding: 10
        //                 }
        //             }]
        //         },
        //         title: {
        //             display: false
        //         },
        //         hover: {
        //             mode: 'index'
        //         },
        //         tooltips: {
        //             enabled: true,
        //             intersect: false,
        //             mode: 'nearest',
        //             bodySpacing: 5,
        //             yPadding: 10,
        //             xPadding: 10,
        //             caretPadding: 0,
        //             displayColors: false,
        //             backgroundColor: this.layoutConfigService.getConfig('colors.state.brand'),
        //             titleFontColor: '#ffffff',
        //             cornerRadius: 4,
        //             footerSpacing: 0,
        //             titleSpacing: 0
        //         },
        //         layout: {
        //             padding: {
        //                 left: 0,
        //                 right: 0,
        //                 top: 5,
        //                 bottom: 5
        //             }
        //         }
        //     }
        // });
    }
}
