import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AvatarService } from 'src/app/services/avatar.service';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Data } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  isLoading = false;
  hasData = false;

  tripHistory: any[] = [];
  cancelledHistory: any[] = [];
  
  displayedTripHistory: any[] = [];
  displayedCancelledHistory: any[] = [];

  private pageSize = 10;
  private currentTripPage = 0;
  private currentCancelledPage = 0;

  skeletOns: {}[];
  hideSkeleton: boolean;
  triphistory: any;
  hasNoData: boolean;

  displayedColumns: string[] = ['Driver Name', 'Driver Phone', 'Rider Name', 'Rider Phone', 'Pickup', 'DropOff', 'Price' ];
  records = new MatTableDataSource;
  displayedColumns2: string[] = ['Driver Name', 'Driver Phone', 'Rider Name', 'Rider Phone', 'Pickup', 'DropOff', 'Price', 'Reason' ];
  records2 = new MatTableDataSource;
  segment: any;
  length: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  segmentModel = "default";
  public data: Data;
  public columns: any;
  public rows: any[];
  redy: number = 3;
  cancelledhistory: any;
  currentRecords: { destination: string; date: Date; price: number; }[];

  constructor(private nav: NavController, private chatService: AvatarService) { 
   
  }

  ngOnInit() {
    this.loadTripHistory();
    this.loadCancelledHistory();
  }

  loadTripHistory() {
    this.isLoading = true;
    this.chatService.getTrips().subscribe(
      (data) => {
        this.tripHistory = data;
        this.displayedTripHistory = this.tripHistory.slice(0, this.pageSize);
        this.hasData = this.tripHistory.length > 0;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading trip history:', error);
        this.isLoading = false;
      }
    );
  }

  loadCancelledHistory() {
    this.isLoading = true;
    this.chatService.getCancelledTrips().subscribe(
      (data) => {
        this.cancelledHistory = data;
        this.displayedCancelledHistory = this.cancelledHistory.slice(0, this.pageSize);
        this.hasData = this.hasData || this.cancelledHistory.length > 0;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading cancelled history:', error);
        this.isLoading = false;
      }
    );
  }

  loadMoreTrips(event: InfiniteScrollCustomEvent) {
    this.currentTripPage++;
    const nextItems = this.tripHistory.slice(
      this.currentTripPage * this.pageSize,
      (this.currentTripPage + 1) * this.pageSize
    );
    this.displayedTripHistory.push(...nextItems);
    event.target.complete();

    if (this.displayedTripHistory.length >= this.tripHistory.length) {
      event.target.disabled = true;
    }
  }

  loadMoreCancelledTrips(event: InfiniteScrollCustomEvent) {
    this.currentCancelledPage++;
    const nextItems = this.cancelledHistory.slice(
      this.currentCancelledPage * this.pageSize,
      (this.currentCancelledPage + 1) * this.pageSize
    );
    this.displayedCancelledHistory.push(...nextItems);
    event.target.complete();

    if (this.displayedCancelledHistory.length >= this.cancelledHistory.length) {
      event.target.disabled = true;
    }
  }

  async ionViewDidEnter() {
    this.skeletOns = [
      {},{},{},{}
    ]

    this.hideSkeleton = true;
    this.triphistory = (this.chatService.getTrips())
    this.cancelledhistory = (this.chatService.getCancelledTrips())

    this.triphistory.subscribe((d)=>{
      console.log(d);
      this.records.data = d;
      this.length = this.records.data.length;
      this.records.paginator = this.paginator;
      this.records.sort = this.sort;
      this.rows = d;

      if (d.length == 0){
        this.hasNoData = true;
        this.hideSkeleton = false;
      }else{
        this.hideSkeleton = false;
        this.hasNoData = false;
      }
  })


  this.cancelledhistory.subscribe((d)=>{
    console.log(d)

     this.records2.data = d;
    this.length = this.records2.data.length;
    this.records2.paginator = this.paginator;
    this.records2.sort = this.sort;
   
    this.rows = d;

    if (d.length == 0){
      this.hasNoData = true;
      this.hideSkeleton = false;
    }else{
      this.hideSkeleton = false;
      this.hasNoData = false;
    }
})

  }

  loadInitialData() {
    // Simulate loading data from an API
    setTimeout(() => {
      this.currentRecords = [
        { destination: 'New York', date: new Date(), price: 100 },
        { destination: 'Los Angeles', date: new Date(), price: 150 },
        // Add more mock data as needed
      ];
      this.isLoading = false;
      this.hasData = this.currentRecords.length > 0;
    }, 2000);
  }

  loadMoreData(event: any) {
    const infiniteScroll = event as InfiniteScrollCustomEvent;
    // Simulate loading more data
    setTimeout(() => {
      const newRecords = [
        { destination: 'Chicago', date: new Date(), price: 120 },
        { destination: 'Miami', date: new Date(), price: 130 },
        // Add more mock data as needed
      ];
      this.currentRecords.push(...newRecords);
      infiniteScroll.target.complete();

      // Optional: Disable infinite scroll if all data is loaded
      if (this.currentRecords.length >= 50) {
        infiniteScroll.target.disabled = true;
      }
    }, 1000);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.records.filter = filterValue.trim().toLowerCase();

    if (this.records.paginator) {
      this.records.paginator.firstPage();
    }
  }

  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.records2.filter = filterValue.trim().toLowerCase();

    if (this.records2.paginator) {
      this.records2.paginator.firstPage();
    }
  }

  Increase(){
    
    if ( this.rows.length > this.redy){
    // this.redy++;
    this.rows.splice(2)
    }
  }

  Decrease(){
    this.rows.splice(0, this.rows.length)
  }

  goBack(){
    this.nav.pop();
  }
}
