import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LoadingController, ModalController, ModalOptions } from '@ionic/angular';
import { DriverComponent } from 'src/app/driver/driver.component';
import { RiderComponent } from 'src/app/rider/rider.component';
import { AvatarService } from 'src/app/services/avatar.service';

// Define the Rider interface
interface Rider {
  Rider_id: string;
  Rider_imgUrl: string;
  Rider_name: string;
  Rider_phone: string;
  Rider_email: string;
  Rider_rating: number;
}

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit {
  skeletOns: {}[];
  hideSkeleton: boolean;
  drivers: any;
  hasNoData: boolean;
  segmentModel = "default";
  triphistory: any;

  displayedColumns: string[] = ['Rider Name', 'Rider Phone', 'Rider Email', 'Rider Rating', 'Rider Image', 'Edit', 'Delete', 'UnDelete' ];
  records = new MatTableDataSource<Rider>();
  displayedColumns2: string[] = ['Rider Name', 'Rider Phone', 'Rider Email', 'Rider Rating',  'Rider Latitude', 'Rider Longitude' ];
  records2 = new MatTableDataSource;
  segment: any;
  length: number = 0;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public columns: any;
  public rows: any[];
  redy: number = 3;
  cancelledhistory: any;

  constructor(private chatService: AvatarService, public modalCtrl: ModalController, private loadingController: LoadingController) { }



  async ionViewDidEnter() {
    this.skeletOns = [
      {},{},{},{}
    ]

    this.hideSkeleton = true;
    this.triphistory = (this.chatService.getRiders())

    this.triphistory.subscribe((d: Rider[]) => {
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

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.records.filter = filterValue.trim().toLowerCase();

    if (this.records.paginator) {
      this.records.paginator.firstPage();
    }
  }


  async EditDriver(item){
    console.log(item);
    const options: ModalOptions = {
      component: RiderComponent,
      componentProps: {
        info: item,
        
      },
      swipeToClose: true
    };
    const modal = this.modalCtrl.create(options);
    (await modal).present();
    const data: any = (await modal).onWillDismiss();
  }

  async BlockDriver(element){
    await this.chatService.DriverBlock(true, element.Driver_id)
  }

  async UnBlockDriver(element){
    await this.chatService.DriverBlock(false, element.Driver_id)
  }


  ngOnInit() {
  }

  async AddDriver(){
    const options: ModalOptions = {
      component: RiderComponent,
      swipeToClose: true
    };
    const modal = this.modalCtrl.create(options);
    (await modal).present();
    const data: any = (await modal).onWillDismiss();
  }

  async gotoDocs(e){
    console.log(e)
    const loading = await this.loadingController.create();
    await loading.present();
    const fk = await this.chatService.CustomerBlock(true, e.Rider_id);

    loading.dismiss();
      
  }

  openFilter() {
    // Implement filter logic here
    console.log('Filter opened');
  }

  loadMore(event: any) {
    // Implement load more logic here
    console.log('Loading more items');
    event.target.complete();
  }

}
