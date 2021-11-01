import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

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
  dynamicList = [];
  dynamicDataSource;

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  machines: Machine[] = [];
  isLoading: boolean = false;
  isVisible: boolean = false;
  private machinesSub: Subscription;
  length = this.machines.length;

  constructor(
    private dialog: MatDialog,
    public machineService: MachineService
  ) {}

  ngOnInit(): void {
    this.machineService.getMachines();

    this.machinesSub = this.machineService
      .getMachineUpdateListener()
      .subscribe((machines: any[]) => {
        this.isLoading = false;
        this.machines = machines;
        this.dynamicList = machines;
        var length = this.dynamicList.length;
        if (length > 0) {
          this.dynamicDisplayedColumns = Object.keys(this.dynamicList[0]);
          console.log(this.dynamicDisplayedColumns);
        }
        this.dataSource = new MatTableDataSource<any>(machines);
        this.dataSource.paginator = this.paginator;
        this.machineService.putDynamicColumns(this.dynamicDisplayedColumns);
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
  }
}
