import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatMenuItem } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { MachineCreateComponent } from '../machine-create/machine-create.component';
import { MachineEditComponent } from '../machine-edit/machine-edit.component';
import { Machine } from '../machine.model';
import { MachineService } from '../machine.service';
import { MachineFileImportComponent } from '../machine-file-import/machine-file-import.component';

@Component({
  selector: 'app-machine-list',
  templateUrl: './machine-list.component.html',
  styleUrls: ['./machine-list.component.css'],
})
export class MachineListComponent implements OnInit {
  dynamicDisplayedColumns = [];
  dynamicKeyValColumns = [];
  dynamicList = [];
  dynamicKeyvals = [];
  dynamicDataSource;

  dataSource: MatTableDataSource<any>;
  KeyValSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  machines: Machine[] = [];
  collections: any[] = [];
  KeyVals: any[] = [];

  isLoading: boolean = false;
  isVisible: boolean = false;
  private machinesSub: Subscription;
  private machineKeyValSub: Subscription;
  length = this.machines.length;
  collectionchoose: any;
  constructor(
    private dialog: MatDialog,
    public machineService: MachineService
  ) {}

  ngOnInit(): void {
    //this.onCallCollection();
    // if(this.collections){

    // }
    this.machineService.getCollections();
    this.machinesSub = this.machineService
      .getCollectionUpdateListener()
      .subscribe((collections: any[]) => {
        this.isLoading = false;
        var colldata = collections.filter((data) => !data.includes('_keyvals'));
        //console.log('Colldata', colldata);
        this.collections = colldata;
      });
    this.machineService.getMachines();
    this.machinesSub = this.machineService
      .getMachineUpdateListener()
      .subscribe((machines: any[]) => {
        this.isLoading = false;
        this.machines = machines;
        this.dynamicList = machines;
        var length = this.dynamicList.length;
        // console.log('Length of File :', this.dynamicList.length);
        if (length > 0) {
          this.dynamicDisplayedColumns = Object.keys(this.dynamicList[0]);
          console.log(this.dynamicDisplayedColumns);
        }
        this.dataSource = new MatTableDataSource<any>(machines);
        this.dataSource.paginator = this.paginator;
        this.machineService.putDynamicColumns(this.dynamicDisplayedColumns);
      });

    this.machineService.getMachineKeyVals();

    this.machineKeyValSub = this.machineService
      .getMachineKeyValUpdateListener()
      .subscribe((machines: any[]) => {
        this.isLoading = false;
        this.KeyVals = machines;
        this.dynamicKeyvals = machines;
        var length = this.dynamicKeyvals.length;

        if (length > 0) {
          this.dynamicKeyValColumns = Object.keys(this.dynamicKeyvals[0]);
          console.log('Dynamic KeyVal Columns', this.dynamicKeyValColumns);
        }
        this.KeyValSource = new MatTableDataSource<any>(machines);
        // this.KeyValSource.paginator = this.paginator;
        this.machineService.putDynamicKeyVal(this.dynamicKeyValColumns);
      });
  }

  showDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';

    this.isVisible = true;
    this.dialog.open(MachineFileImportComponent, dialogConfig);
  }

  onAddItem() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    this.dialog.open(MachineCreateComponent, dialogConfig);
  }

  onSelectCollection(val) {
    console.log(val);
    this.machineService.passusercollection(val);
    this.machineService.getMachines();
  }

  onEdit(machine) {
    console.log(machine);
    this.machineService.postId(machine);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    this.dialog.open(MachineEditComponent, dialogConfig);
  }

  onDelete(machineId: string) {
    this.isLoading = true;
    this.machineService.deleteMachine(machineId);
    this.isLoading = false;
  }

  ngOnDestroy() {
    this.machinesSub.unsubscribe();
    this.machineKeyValSub.unsubscribe();
  }
}
