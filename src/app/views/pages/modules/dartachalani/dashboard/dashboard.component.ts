import { Paginator } from './../../../../../models/filter-sort-pager.model';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { Component, ElementRef, OnInit, ViewChild, AfterContentChecked } from '@angular/core';
import * as Chart from 'chart.js';
import { shuffle } from 'lodash';
import { SparklineChartOptions, LayoutConfigService } from '../../../../../../../src/app/core/_base/layout';
import { Widget4Data } from '../../../../../../../src/app/views/partials/content/widgets/widget4/widget4.component';
import { DartaService } from '../darta/darta.service';
import { ChalaniService } from '../chalani/chalani.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { delay } from 'rxjs/operators';

@Component({
    selector: 'kt-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['../dashboard/dashboard.component.scss'],
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
    @ViewChild('chart', { static: true }) chart: ElementRef;
    displayedColumns: string[] = ['select', 'id', 'regNo', 'noofLetter', 'subject', 'letterKind', 'senderOfficeName', 'branch'];
    dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
    selection = new SelectionModel<any>(true, []);
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    chalaniColumns: string[] = ['select', 'id', 'invoiceNo', 'subject', 'letterKindId', 'branchIds', 'receivers', 'officeAddress'];
    dataSourceOne: MatTableDataSource<any> = new MatTableDataSource([]);
    selection1 = new SelectionModel<any>(true, []);
    @ViewChild('Chalanipaginator', { static: true }) Chalanipaginator: MatPaginator;
    @ViewChild('Chalanisort', { static: true }) Chalanisort: MatSort;
    dartaList: any[] = [];
    chalaniList: any[] = [];
    isLoadingResults = true;

    dartaFilterOptions = 'सबै वडाहरु';
    dartaFilterOptionDays = 'All';
    chalaniFilterOptions = 'सबै वडाहरु';
    chalanifilterOptionDays = 'All';

    constructor(
        private layoutConfigService: LayoutConfigService,
        private dService: DartaService,
        private cService: ChalaniService
    ) {
    }

    // for chalani
    chalanifilterOption(e) {
        this.chalaniFilterOptions = e;

        if (this.chalaniFilterOptions === 'सबै वडाहरु') {
            this.cService.getList().pipe(delay(600)).subscribe({
                next: res => {
                    this.dataSourceOne.data = res;
                    this.paginator.length = res.length;
                    this.isLoadingResults = false;
                    this.dataSourceOne._updateChangeSubscription();
                }
            });

        } else if (this.chalaniFilterOptions === 'वडा न 1') {
            this.cService.getList().pipe(delay(600)).subscribe({
                next: res => {
                    const d = res.slice(3, 10).reverse();
                    this.dataSourceOne.data = d;
                    const l = res.slice(3, 10);
                    this.paginator.length = l.length;
                    this.dataSourceOne._updateChangeSubscription();
                }
            });

        } else if (this.chalaniFilterOptions === 'वडा न 2') {
            this.cService.getList().pipe(delay(600)).subscribe({
                next: res => {
                    const d = res.slice(2, 11).reverse();
                    this.dataSourceOne.data = d;
                    const l = res.slice(2, 11);
                    this.paginator.length = l.length;
                    this.dataSourceOne._updateChangeSubscription();
                }
            });

        } else if (this.chalaniFilterOptions === 'वडा न 3') {
            this.cService.getList().pipe(delay(600)).subscribe({
                next: res => {
                    const d = res.slice(1, 9);
                    this.dataSourceOne.data = d;
                    this.paginator.length = (d.length || 0);
                    this.dataSourceOne._updateChangeSubscription();
                }
            });

        } else if (this.chalaniFilterOptions === 'वडा न 4') {
            this.cService.getList().pipe(delay(600)).subscribe({
                next: res => {
                    const d = res.slice(6, 11).reverse();
                    this.dataSourceOne.data = d;
                    const l = res.slice(6, 11);
                    this.paginator.length = (l.length || 0);
                    this.dataSourceOne._updateChangeSubscription();
                }
            });


        } else if (this.chalaniFilterOptions === 'वडा न 5') {
            this.cService.getList().pipe(delay(600)).subscribe({
                next: res => {
                    const d = res.slice(5, 11);
                    this.dataSourceOne.data = d;
                    this.paginator.length = (d.length || 0);
                    this.dataSourceOne._updateChangeSubscription();
                }
            });

        }
    }
    chalanifilterOptionDay(c) {
        this.chalanifilterOptionDays = c;

        if (this.chalanifilterOptionDays === 'Today') {
            const data = this.dataSourceOne.data;
            const d = data.slice(0, 3);
            this.dataSourceOne.data = data.slice(0, 3);
            this.paginator.length = d.length;
        } else if (this.chalanifilterOptionDays === 'Yesterday') {
            const data = this.dataSourceOne.data;
            const d = data.slice(0, 4);
            this.dataSourceOne.data = data.slice(0, 4);
            this.paginator.length = d.length;
        } else if (this.chalanifilterOptionDays === 'This week') {
            const data = this.dataSourceOne.data;
            const d = data.slice(0, 5);
            this.dataSourceOne.data = data.slice(0, 5);
            this.paginator.length = d.length;
        } else if (this.chalanifilterOptionDays === 'This month') {
            const data = this.dataSourceOne.data;
            const d = data.slice(0, 6);
            this.dataSourceOne.data = data.slice(0, 6).reverse();
            this.paginator.length = d.length;
        } else if (this.chalanifilterOptionDays === 'Custom range') {
            const data = this.dataSourceOne.data;
            const d = data.slice(0, 7);
            this.dataSourceOne.data = data.slice(0, 7).reverse();
            this.paginator.length = d.length;
        }
    }
    // for darta
    dartaFilterOption(x) {
        this.dartaFilterOptions = x;
        if (this.dartaFilterOptions === 'सबै वडाहरु') {
            this.dService.getList().pipe(delay(600)).subscribe({
                next: res => {
                    this.dataSource.data = res;
                    this.paginator.length = res.length;
                    this.isLoadingResults = false;
                    this.dataSource._updateChangeSubscription();
                }
            });

        } else if (this.dartaFilterOptions === 'वडा न 1') {
            this.dService.getList().pipe(delay(600)).subscribe({
                next: res => {
                    const d = res.slice(3, 10).reverse();
                    this.dataSource.data = d;
                    const l = res.slice(3, 10);
                    this.paginator.length = l.length;
                    this.dataSource._updateChangeSubscription();
                }
            });

        } else if (this.dartaFilterOptions === 'वडा न 2') {
            this.dService.getList().pipe(delay(600)).subscribe({
                next: res => {
                    const d = res.slice(2, 11).reverse();
                    this.dataSource.data = d;
                    const l = res.slice(2, 11);
                    this.paginator.length = l.length;
                    this.dataSource._updateChangeSubscription();
                }
            });

        } else if (this.dartaFilterOptions === 'वडा न 3') {
            this.dService.getList().pipe(delay(600)).subscribe({
                next: res => {
                    const d = res.slice(1, 9);
                    this.dataSource.data = d;
                    this.paginator.length = (d.length || 0);
                    this.dataSource._updateChangeSubscription();
                }
            });

        } else if (this.dartaFilterOptions === 'वडा न 4') {
            this.dService.getList().pipe(delay(600)).subscribe({
                next: res => {
                    const d = res.slice(6, 11).reverse();
                    this.dataSource.data = d;
                    const l = res.slice(6, 11);
                    this.paginator.length = (l.length || 0);
                    this.dataSource._updateChangeSubscription();
                }
            });

        } else if (this.dartaFilterOptions === 'वडा न 5') {
            this.dService.getList().pipe(delay(600)).subscribe({
                next: res => {
                    const d = res.slice(5, 11);
                    this.dataSource.data = d;
                    this.paginator.length = (d.length || 0);
                    this.dataSource._updateChangeSubscription();
                }
            });
        }
    }
    dartaFilterOptionDay(f) {
        this.dartaFilterOptionDays = f;

        if (this.dartaFilterOptionDays === 'Today') {
            const data = this.dataSource.data;
            const d = data.slice(0, 3);
            this.dataSource.data = data.slice(0, 3);
            this.paginator.length = d.length;
        } else if (this.dartaFilterOptionDays === 'Yesterday') {
            const data = this.dataSource.data;
            const d = data.slice(0, 4);
            this.dataSource.data = data.slice(0, 4);
            this.paginator.length = d.length;
        } else if (this.dartaFilterOptionDays === 'This week') {
            const data = this.dataSource.data;
            const d = data.slice(0, 5);
            this.dataSource.data = data.slice(0, 5);
            this.paginator.length = d.length;
        } else if (this.dartaFilterOptionDays === 'This month') {
            const data = this.dataSource.data;
            const d = data.slice(0, 6);
            this.dataSource.data = data.slice(0, 6).reverse();
            this.paginator.length = d.length;
        } else if (this.dartaFilterOptionDays === 'Custom range') {
            const data = this.dataSource.data;
            const d = data.slice(0, 7);
            this.dataSource.data = data.slice(0, 7).reverse();
            this.paginator.length = d.length;
        }

    }
    // checkbox selection for darta List
    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    /** Whether the number of selected elements matches the total number of rows. for chalani */
    isAllSelected1() {
        const numSelected = this.selection1.selected.length;
        const numRows = this.dataSourceOne.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle1() {
        this.isAllSelected1() ?
            this.selection1.clear() :
            this.dataSourceOne.data.forEach(row => this.selection1.select(row));
    }


    ngOnInit(): void {
        this.dService.getList().pipe().subscribe(_ => this.dataSource.data = _);
        this.cService.getList().pipe().subscribe(_ => this.dataSourceOne.data = _);
        this.dataSourceOne.paginator = this.Chalanipaginator;
        this.dataSourceOne.sort = this.Chalanisort;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

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
    }
}
