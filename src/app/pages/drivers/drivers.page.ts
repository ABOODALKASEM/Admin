import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertController, LoadingController, ModalController, ModalOptions } from '@ionic/angular';
import { DriverDocumentsComponent } from 'src/app/driver-documents/driver-documents.component';
import { DriverComponent } from 'src/app/driver/driver.component';
import { AvatarService } from 'src/app/services/avatar.service';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.page.html',
  styleUrls: ['./drivers.page.scss'],
})
export class DriversPage implements OnInit {
  skeletOns: {}[];
  hideSkeleton: boolean;
  drivers: any;
  hasNoData: boolean;
  segmentModel = "default";
  triphistory: any;

  displayedColumns: string[] = ['Driver Name', 'Driver Phone', 'Driver Car', 'Driver CarType', 'Driver Email', 'Driver Plate', 'Driver Rating', 'Driver Earnings', 'Driver Latitude', 'Driver Longitude', 'Driver Image', 'Documents', 'Edit', 'Delete', 'UnDelete' ];
  records = new MatTableDataSource;
  displayedColumns2: string[] = ['Driver Name', 'Driver Phone', 'Driver Car', 'Driver CarType', 'Driver Email', 'Driver Plate', 'Driver Image', 'Documents', 'Accept', 'Edit' ];
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
  constructor(private chatService: AvatarService, public modalCtrl: ModalController, private loadingController: LoadingController, public alertController: AlertController) { }


  async ionViewDidEnter() {
    this.skeletOns = [
      {},{},{},{}
    ]

    this.hideSkeleton = true;
    this.drivers = (this.chatService.getDrivers())

   
   

   
  this.drivers.subscribe((d)=>{
    this.records.data = [];
    d.forEach(element => {
     if (element.Approved == true)
     this.records.data.push(element)
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
   });
  })


  this.drivers.subscribe((d)=>{
    this.records2.data = [];
   d.forEach(element => {
    if (element.Approved == false)
    this.records2.data.push(element)
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
  });
})

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

  ngOnInit() {
  }


  async AddDriver(){
    const options: ModalOptions = {
      component: DriverComponent,
      swipeToClose: true
    };
    const modal = this.modalCtrl.create(options);
    (await modal).present();
    const data: any = (await modal).onWillDismiss();
  }

  async EditDriver(item){
    console.log(item);
    const options: ModalOptions = {
      component: DriverComponent,
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


  async gotoDocs(e){
    const options: ModalOptions = {
      component: DriverDocumentsComponent,
      componentProps: {
        info: e,
      },
      swipeToClose: true
    };
    const modal = this.modalCtrl.create(options);
    (await modal).present();
    const data: any = (await modal).onWillDismiss();
  }

  async Approve(e){
    console.log(e)
    const loading = await this.loadingController.create();
    await loading.present();
    const fk = await this.chatService.UpdateDriverApprove(true, e.Driver_id);

    loading.dismiss();

    const alert = await this.alertController.create({
      header: e.Driver_name + ' Has Been Added',
      message: 'Success',
      buttons: ['OK'],
    });
    await alert.present();
      
  }

}
